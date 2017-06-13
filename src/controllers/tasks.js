import url from 'url';
// import _ from 'lodash';
import buildFormObj from '../lib/formObjectBuilder';
import requiredAuth from '../lib/requiredAuth';

const getUsers = async (User, id) => {
  const users = await User.findAll({ order: 'firstName' });
  return users.map((user) => {
    if (id && user.id === id) {
      return { id: user.id, name: '<< me >>' };
    }

    return { id: user.id, name: user.fullName };
  });
};

const getFilters = (query, { User, TaskStatus, Tag }) => {
  if (!query) return {};
  const filters = [];
  const creator = query['form[creator]'];
  const assignedTo = query['form[assignedTo]'];
  const status = query['form[status]'];
  const tag = query['form[tag]'];

  if (creator && creator > 0) {
    filters.push({ model: User, as: 'creator', where: { id: creator } });
  }
  if (assignedTo && assignedTo > 0) {
    filters.push({ model: User, as: 'assignedTo', where: { id: Number(assignedTo) } });
  }
  if (status && status > 0) {
    filters.push({ model: TaskStatus, where: { id: Number(status) } });
  }
  if (tag) {
    filters.push({ model: Tag, where: { name: { $like: `%${tag}%` } } });
  }

  return { include: filters };
};

export default (router, { User, TaskStatus, Task, Tag }) => {
  router
  .get('tasks', '/tasks', async (ctx) => {
    const currentUser = ctx.session.userId;
    const { query } = url.parse(ctx.request.url, true);
    const filters = getFilters(query, { User, TaskStatus, Tag });
    const tasks = await Task.findAll(filters);
    const users = [{ id: 0, name: '-- all --' }, ...await getUsers(User, currentUser)];
    const statuses = [{ id: 0, name: '-- all --' }, ...await TaskStatus.findAll()];

    ctx.render('tasks', { f: buildFormObj(query), tasks, users, statuses });
  })
  .get('newTask', '/tasks/new', requiredAuth, async (ctx) => {
    const currentUser = ctx.session.userId;
    const users = await getUsers(User, currentUser);
    const statuses = await TaskStatus.findAll();
    const task = Task.build();
    ctx.render('tasks/new', { f: buildFormObj(task), currentUser, users, statuses });
  });
};
