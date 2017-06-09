// import buildFormObj from '../lib/formObjectBuilder';

export default (router, { TaskStatus }) => {
  router
    .get('taskStatuses', '/taskStatuses', async (ctx) => {
      const taskStatuses = await TaskStatus.findAll();
      ctx.render('taskStatuses', { taskStatuses });
    })
    .get('newTaskStatus', '/taskStatus/new/:name', async (ctx) => {
      const name = ctx.params.name;
      const taskStatus = TaskStatus.build({ name });
      await taskStatus.save();
      ctx.flash.set({ text: `Status "${name}"" has been created`, type: 'alert-success' });
      ctx.redirect(router.url('taskStatuses'));
    })
    .post('taskStatus', '/taskStatus', async (ctx) => {
      const form = ctx.request.body.form;
      const taskStatus = TaskStatus.build(form);
      try {
        await taskStatus.save();
        ctx.flash.set({ text: 'TaskStatus has been created', type: 'alert-success' });
        ctx.redirect(router.url('root'));
      } catch (e) {
        // ctx.render('taskStatuses/new', { f: buildFormObj(taskStatus, e) });
      }
    });
};
