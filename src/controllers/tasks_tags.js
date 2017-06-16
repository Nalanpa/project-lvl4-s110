export default (router, { Tag, Task }) => {
  router

  .post('tasksTagsCreate', '/tasks/:id/tags', async (ctx) => {
    const taskId = Number(ctx.params.id);
    const form = ctx.request.body.form;
    const tagExist = await Tag.findOne({ where: { name: form.name } });
    if (tagExist) {
      ctx.flash.set({ text: `Error: Tag with name '${form.name}' already exist`, type: 'alert-danger' });
      ctx.redirect(router.url('tasksShow', taskId));
      return;
    }
    try {
      const tag = await Tag.create(form);
      const task = await Task.findById(taskId);
      await task.addTag(tag);
      await task.save();
      ctx.flash.set({ text: `Tag ${form.name} has been added to task '${task.name}'`, type: 'alert-success' });
      ctx.redirect(router.url('tasksShow', taskId));
    } catch (e) {
      ctx.flash.set({ text: 'Error creating tag', type: 'alert-danger' });
      console.error('ERROR: ', e);
    }
  })

  .put('tasksTagsAdd', '/tasks/:id/tags', async (ctx) => {
    const taskId = Number(ctx.params.id);
    const form = ctx.request.body.form;
    if (!form) {
      ctx.flash.set({ text: 'No tags selected', type: 'alert-danger' });
      ctx.redirect(router.url('tasksShow', taskId));
      return;
    }
    try {
      const tags = form.tags;
      const task = await Task.findById(taskId);
      await task.addTags(tags);
      await task.save();
      ctx.flash.set({ text: `Tags has been added to task '${task.name}'`, type: 'alert-success' });
      ctx.redirect(router.url('tasksShow', taskId));
    } catch (e) {
      ctx.flash.set({ text: 'Error adding tags', type: 'alert-danger' });
      console.error('ERROR: ', e);
    }
  })

  .delete('tasksTagsDelete', '/tasks/:id/tags', async (ctx) => {
    const taskId = Number(ctx.params.id);
    const form = ctx.request.body.form;
    if (!form) {
      ctx.flash.set({ text: 'No tags selected', type: 'alert-danger' });
      ctx.redirect(router.url('tasksShow', taskId));
      return;
    }
    try {
      const tags = [form.tags];
      const task = await Task.findById(taskId);
      await task.removeTags(tags);
      await task.save();
      ctx.flash.set({ text: `Tags has been deleted from task '${task.name}'`, type: 'alert-success' });
      ctx.redirect(router.url('tasksShow', taskId));
    } catch (e) {
      ctx.flash.set({ text: 'Error deleting tags', type: 'alert-danger' });
      console.error('ERROR: ', e);
    }
  });
};
