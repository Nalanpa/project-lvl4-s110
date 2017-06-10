// import buildFormObj from '../lib/formObjectBuilder';

export default (router, { Tag }) => {
  router
    .get('tags', '/tags', async (ctx) => {
      const tags = await Tag.findAll();
      ctx.render('tags', { tags });
    })

    .post('tagsCreate', '/tags', async (ctx) => {
      const form = ctx.request.body.form;
      const tag = Tag.build(form);
      try {
        await tag.save();
        ctx.flash.set({ text: `Tag ${form.name} has been created`, type: 'alert-success' });
        ctx.redirect(router.url('root'));
      } catch (e) {
        // ctx.render('tags/new', { f: buildFormObj(tag, e) });
      }
    })

    .delete('tagsDelete', '/tags/:name', async (ctx) => {
      const url = ctx.request.url;
      const name = url.substr(url.indexOf('/', 1) + 1);
      try {
        await Tag.destroy({ where: { name } });
        ctx.flash.set({ text: `Tag ${name} has been deleted`, type: 'alert-success' });
        ctx.redirect(router.url('root'));
      } catch (e) {
        //
      }
    });
};
