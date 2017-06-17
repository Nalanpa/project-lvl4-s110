import _ from 'lodash';

export default (router, { Tag, Task }) => {
  router
    .get('tagsIndex', '/tags', async (ctx) => {
      const unsortedAddedTags = await Tag.findAll({
        include: [{ model: Task, where: { id: { $gt: 0 } } }],
      });
      const addedTags = _.sortBy(unsortedAddedTags, ['name']);

      const addedTagIds = [0, ...addedTags.map(item => item.id)];
      const unsortedFreeTags = await Tag.findAll({
        where: { id: { $notIn: addedTagIds } },
      });
      const freeTags = _.sortBy(unsortedFreeTags, ['name']);

      ctx.render('tags', { addedTags, freeTags });
    })

    .post('tagsCreate', '/tags', async (ctx) => {
      const form = ctx.request.body.form;
      try {
        await Tag.create(form);
        ctx.flash.set({ text: `Tag ${form.name} has been created`, type: 'alert-success' });
        ctx.redirect(router.url('root'));
      } catch (e) {
        ctx.flash.set({ text: 'Error adding tag', type: 'alert-danger' });
        console.error('ERROR: ', e);
      }
    })

    .delete('tagsDelete', '/tags/:id', async (ctx) => {
      const id = Number(ctx.params.id);
      try {
        await Tag.destroy({ where: { id } });
        ctx.flash.set({ text: 'Tag has been deleted', type: 'alert-success' });
        ctx.redirect(router.url('tagsIndex'));
      } catch (e) {
        ctx.flash.set({ text: 'Error deleting tag', type: 'alert-danger' });
        console.error('ERROR: ', e);
      }
    });
};
