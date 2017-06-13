import url from 'url';
import buildFormObj from '../lib/formObjectBuilder';
// import requiredAuth from '../lib/requiredAuth';

const getUsers = async (User, id) => {
  const users = await User.findAll({ order: 'firstName' });
  return users.map((user) => {
    if (id && user.id === id) {
      return { id: user.id, name: '<< me >>' };
    }

    return { id: user.id, name: user.fullName };
  });
};

export default (router, { User, Task, TaskStatus }) => {
  router
    .get('usersIndex', '/users', async (ctx) => {
      const users = await User.findAll();
      ctx.render('users/index', { users });
    })

    .post('usersCreate', '/users', async (ctx) => {
      const form = ctx.request.body.form;
      const user = User.build(form);
      try {
        await user.save();
        ctx.flash.set({ text: 'User has been created', type: 'alert-success' });
        ctx.redirect(router.url('root'));
      } catch (e) {
        ctx.render('users/new', { f: buildFormObj(user, e) });
      }
    })

    .get('usersNew', '/users/new', (ctx) => {
      const user = User.build();
      ctx.render('users/new', { f: buildFormObj(user) });
    })

    .get('userTasks', '/users/:id/tasks', async (ctx) => {
      const currentUser = ctx.session.userId;
      const { query } = url.parse(ctx.request.url, true);
      const userId = Number(ctx.params.id);
      const tasks = await Task.findAll({ where:
        { $or: { creatorId: userId, assignedToId: userId } } });
      const users = [{ id: 0, name: '-- all --' }, ...await getUsers(User, currentUser)];
      const statuses = [{ id: 0, name: '-- all --' }, ...await TaskStatus.findAll()];
      ctx.render('tasks', { f: buildFormObj(query), tasks, users, statuses });
    });
};
