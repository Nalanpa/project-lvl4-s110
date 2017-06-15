import url from 'url';
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
  const creator = Number(query.creator);
  const assignedTo = Number(query.assignedTo);
  const status = Number(query.status);
  const tag = query.tag;

  if (creator && creator > 0) {
    filters.push({ model: User, as: 'creator', where: { id: creator } });
  }
  if (assignedTo && assignedTo > 0) {
    filters.push({ model: User, as: 'assignedTo', where: { id: assignedTo } });
  }
  if (status && status > 0) {
    filters.push({ model: TaskStatus, as: 'status', where: { id: status } });
  }
  if (tag) {
    filters.push({ model: Tag, where: { name: { $like: `%${tag}%` } } });
  }
  return { include: filters };
};

const getTitle = async (query, { User, TaskStatus }) => {
  if (!query) return {};

  let title = 'Tasks';
  const creatorId = Number(query.creator);
  const assignedToId = Number(query.assignedTo);
  const statusId = Number(query.status);
  const tag = query.tag;

  if (creatorId && creatorId > 0) {
    const creator = await User.findById(creatorId);
    title = `${title} created by '${creator.fullName}'`;
  }
  if (assignedToId && assignedToId > 0) {
    const worker = await User.findById(assignedToId);
    title = `${title} assigned to '${worker.fullName}'`;
  }
  if (statusId && statusId > 0) {
    const status = await TaskStatus.findById(statusId);
    title = `${title} with status '${status.name}'`;
  }
  if (tag) {
    title = `${title} with tag '${tag}'`;
  }

  return title;
};


export default (router, { User, TaskStatus, Task, Tag }) => {
  router
  .get('test', '/test', async (ctx) => { // >>>>
    const user = await User.findOne();
    ctx.session.userId = user.id;
    ctx.session.userName = user.fullName;
    ctx.redirect(router.url('tasksShow', 2));
  })

  .get('tasksIndex', '/tasks', async (ctx) => {
    const currentUser = ctx.session.userId;
    const { query } = url.parse(ctx.request.url, true);
    const filters = getFilters(query, { User, TaskStatus, Tag });
    filters.order = ['Task.createdAt'];
    const tasks = await Task.findAll(filters);
    const users = [{ id: 0, name: '-- all --' }, ...await getUsers(User, currentUser)];
    const statuses = [{ id: 0, name: '-- all --' }, ...await TaskStatus.findAll()];
    const title = await getTitle(query, { User, TaskStatus });

    ctx.render('tasks', { f: buildFormObj(query), tasks, users, statuses, title });
  })

  .get('tasksNew', '/tasks/new', requiredAuth, async (ctx) => {
    const currentUser = ctx.session.userId;
    const users = await getUsers(User, currentUser);
    const statuses = await TaskStatus.findAll();
    const task = Task.build();
    ctx.render('tasks/new', { f: buildFormObj(task), currentUser, users, statuses });
  })

  .post('tasksCreate', '/tasks', requiredAuth, async (ctx) => {
    const currentUser = ctx.session.userId;
    const form = ctx.request.body.form;
    try {
      await Task.create({
        name: form.name,
        description: form.description,
        statusId: form.status,
        creatorId: currentUser,
        assignedToId: form.assignedTo,
      });
      ctx.flash.set('Task has been created');
      ctx.redirect(router.url('tasksIndex'));
    } catch (e) {
      const users = await getUsers(User, currentUser);
      const statuses = await TaskStatus.findAll();
      ctx.render('tasks/new', { f: buildFormObj(form, e), currentUser, users, statuses });
    }
  })

  .get('tasksShow', '/tasks/:id', async (ctx) => {
    const taskId = Number(ctx.params.id);
    const task = await Task.findById(taskId);
    if (!task) {
      ctx.redirect(router.url('tasksIndex'));
      return;
    }
    const creator = await User.findById(task.creatorId);
    const status = await TaskStatus.findById(task.statusId);
    const assigned = task.assignedToId ? await User.findById(task.assignedToId) : 'none';
    const tags = await Tag.findAll({
      include: [
        { model: Task, where: { id: taskId } },
      ],
    });
    const tag = Tag.build();
    ctx.render('tasks/show', { f: buildFormObj(tag), task, creator, status, assigned, tags });
  })

  .get('tasksEdit', '/tasks/:id/edit', requiredAuth, async (ctx) => {
    const currentUser = ctx.session.userId;
    const taskId = Number(ctx.params.id);
    const task = await Task.findById(taskId);
    if (!task) {
      ctx.redirect(router.url('tasksIndex'));
      return;
    }
    const users = await getUsers(User, currentUser);
    const statuses = await TaskStatus.findAll();

    ctx.render('tasks/edit', { f: buildFormObj(task), task, users, statuses });
  })

  .patch('tasksUpdate', '/tasks/:id/edit', requiredAuth, async (ctx) => {
    const id = ctx.session.userId;
    const taskId = Number(ctx.params.id);
    const task = await Task.findById(taskId);
    if (!task) {
      ctx.redirect(router.url('tasksIndex'));
      return;
    }
    const form = ctx.request.body.form;
    try {
      await task.update({
        name: form.name,
        description: form.description,
        statusId: form.status,
        assignedToId: form.assignedTo,
      });
      ctx.flash.set({ text: 'Task has been updated', type: 'alert-success' });
      ctx.redirect(router.url('tasksShow', taskId));
    } catch (e) {
      ctx.flash.set({ text: 'Something wrong', type: 'alert-danger' });
      console.log('Error >>> ', e);
      console.log('form >>> ', form);
      const users = await getUsers(User, id);
      const statuses = await TaskStatus.findAll();
      ctx.render('tasks/edit', { f: buildFormObj(form, e), task, users, statuses });
    }
  })

  .patch('tasksAddTag', '/tasks/:id/', requiredAuth, async (ctx) => {
    const taskId = Number(ctx.params.id);
    const task = await Task.findById(taskId);
    if (!task) {
      ctx.redirect(router.url('tasks'));
      return;
    }

    const form = ctx.request.body.form;
    try {
      const tag = await Tag.create(form);
      await task.addTag(tag);
      ctx.flash.set('Tag has been created');
    } catch (e) {
      ctx.flash.set('Name is no valid');
    }

    ctx.redirect(router.url('tasksEdit', taskId));
  })

  .delete('tasksDelete', '/tasks/:id', requiredAuth, async (ctx) => {
    const taskId = Number(ctx.params.id);
    await Task.destroy({ where: { id: taskId } });
    ctx.flash.set('Task has been destroy');
    ctx.redirect(router.url('tasksIndex'));
  })

  .get('usersTasks', '/users/:id/tasks', async (ctx) => {
    const currentUser = ctx.session.userId;
    const { query } = url.parse(ctx.request.url, true);
    const userId = Number(ctx.params.id);
    const user = await User.findById(userId);
    const tasks = await Task.findAll({ where:
      { $or: { creatorId: userId, assignedToId: userId } } });
    const users = [{ id: 0, name: '-- all --' }, ...await getUsers(User, currentUser)];
    const statuses = [{ id: 0, name: '-- all --' }, ...await TaskStatus.findAll()];
    const title = `Tasks of user '${user.fullName}'`;
    ctx.render('tasks', { f: buildFormObj(query), tasks, users, statuses, title });
  })

  .get('tagsTasks', '/tags/:id/tasks', async (ctx) => {
    const currentUser = ctx.session.userId;
    const { query } = url.parse(ctx.request.url, true);
    const tag = await Tag.findById(Number(ctx.params.id));
    const tasks = await tag.getTasks();
    const users = [{ id: 0, name: '-- all --' }, ...await getUsers(User, currentUser)];
    const statuses = [{ id: 0, name: '-- all --' }, ...await TaskStatus.findAll()];
    const title = `Tasks with tag '${tag.name}'`;
    ctx.render('tasks', { f: buildFormObj(query), tasks, users, statuses, title });
  });
};
