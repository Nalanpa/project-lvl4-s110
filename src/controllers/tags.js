// import buildFormObj from '../lib/formObjectBuilder';
import sequelize from 'sequelize';

export default (router, { Tag, Task }) => {
  router
    .get('tagsIndex', '/tags', async (ctx) => {
      const assignedTags = await Tag.findAll({
        attributes: [
          ['Tag.id', 'id'],
          ['Tag.name', 'name'],
          [sequelize.fn('COUNT', sequelize.col('Task.id')), 'tasksCount'],
        ],
        group: ['Tag.id', 'Tag.name'],
        include: [{ model: Task, attributes: [] }],
        order: ['Tag.name'],
      });

      assignedTags.reduce((acc, item) => {
        console.log('>>> ', item.id, item.name, item.tasksCount);
        return 1;
      }, '');
      // console.log('>>> tags >>>>> ', assignedTags);
      const assignedTagIds = [0, ...assignedTags.map(item => item.id)];
      const otherTags = await Tag.findAll(
        { where: { id: { $notIn: assignedTagIds } }, order: ['Tag.name'] },
      );
      ctx.render('tags', { assignedTags, otherTags });
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
        ctx.redirect(router.url('root'));
      } catch (e) {
        ctx.flash.set({ text: 'Error deleting tag', type: 'alert-danger' });
        console.error('ERROR: ', e);
      }
    });
};
