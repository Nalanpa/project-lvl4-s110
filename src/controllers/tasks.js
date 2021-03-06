import url from 'url';
import _ from 'lodash';
import buildFormObj from '../lib/formObjectBuilder';
import requiredAuth from '../lib/requiredAuth';
import { getTitle, getUsers, getFilters, getTagsString } from '../lib/tasksHelper';

export default (router, { User, TaskStatus, Task, Tag }) => {
  router
  .get('tasksIndex', '/tasks', async (ctx) => {
    const currentUser = ctx.session.userId;
    const query = ctx.request.body.form;
    const filters = getFilters(query, { User, TaskStatus, Tag });
    const unsortedTasks = await Task.findAll(filters);
    const tasks = _.sortBy(unsortedTasks, ['createdAt']);
    const users = [{ id: 0, name: '-- all --' }, ...await getUsers(User, currentUser)];
    const statuses = [{ id: 0, name: '-- all --' }, ...await TaskStatus.findAll()];
    const title = await getTitle(query, { User, TaskStatus });

    ctx.render('tasks', { f: buildFormObj({}), tasks, users, statuses, title });
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
    const tags = form.tags.split(/[,;]/).map(tag => tag.trim()).filter(tag => tag);
    try {
      const task = await Task.create({
        name: form.name,
        description: form.description,
        creatorId: currentUser,
        assignedToId: currentUser,
      });
      await tags.map(async tag => Tag.findOne({ where: { name: tag } })
          .then(async result => (result ? task.addTag(result) :
            task.createTag({ name: tag }))));
      ctx.flash.set({ text: 'Task has been created', type: 'alert-success' });
      ctx.redirect(router.url('tasksShow', task));
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

    const tagsString = await getTagsString(task);
    ctx.render('tasks/show', { f: buildFormObj(), task, creator, status, assigned, tagsString });
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
    const tags = await getTagsString(task);

    ctx.render('tasks/edit', { f: buildFormObj(task), task, users, statuses, tags });
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
    const tags = form.tags.split(/[,;]/).map(tag => tag.trim()).filter(tag => tag);
    try {
      await task.setTags([]);
      await tags.map(async tag => Tag.findOne({ where: { name: tag } })
          .then(async result => (result ? task.addTag(result) :
            task.createTag({ name: tag }))));
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
      console.error('ERROR: ', e);
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
      ctx.flash.set({ text: 'Tag has been added', type: 'alert-success' });
    } catch (e) {
      ctx.flash.set({ text: 'Name is no valid', type: 'alert-danger' });
    }

    ctx.redirect(router.url('tasksEdit', taskId));
  })

  .delete('tasksDelete', '/tasks/:id', requiredAuth, async (ctx) => {
    const taskId = Number(ctx.params.id);
    await Task.destroy({ where: { id: taskId } });
    ctx.flash.set({ text: 'Tag has been deleted', type: 'alert-success' });
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
