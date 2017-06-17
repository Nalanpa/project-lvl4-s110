import _ from 'lodash';
import buildFormObj from '../lib/formObjectBuilder';


export default (router, { User }) => {
  router
    .get('usersIndex', '/users', async (ctx) => {
      const unsortedUsers = await User.findAll();
      const users = _.sortBy(unsortedUsers, ['firstName']);
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
    });
};
