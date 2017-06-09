import buildFormObj from '../lib/formObjectBuilder';
import encrypt from '../lib/secure';

export default (router, { User }) => {
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

    .get('usersEditPassword', '/users/current/edit/password', async (ctx) => {
      const id = ctx.session.userId;
      if (!id) {
        ctx.redirect(router.url('sessionNew'));
        return;
      }
      const user = await User.findById(id);
      ctx.render('users/edit_password', { f: buildFormObj({}), user });
    })

    .get('usersEditData', '/users/current/edit/data', async (ctx) => {
      const id = ctx.session.userId;
      if (!id) {
        ctx.redirect(router.url('sessionNew'));
        return;
      }
      const user = await User.findById(id);
      ctx.render('users/edit_data', { f: buildFormObj(user), user });
    })

    .put('usersUpdateData', '/users/current/data', async (ctx) => {
      const id = ctx.session.userId;
      if (!id) {
        ctx.redirect(router.url('sessionNew'));
        return;
      }

      const user = await User.findById(id);
      const form = ctx.request.body.form;

      try {
        await user.update(form);
        ctx.flash.set({ text: 'User has been updated', type: 'alert-success' });
        ctx.redirect(router.url('usersEditData'));
      } catch (e) {
        ctx.render('usersEditData', { f: buildFormObj(form, e), user });
      }
    })

    .put('usersUpdatePassword', '/users/current/password', async (ctx) => {
      const id = ctx.session.userId;
      if (!id) {
        ctx.redirect(router.url('sessionNew'));
        return;
      }

      const user = await User.findById(id);
      const { password,
        newPassword,
        confirmation,
      } = ctx.request.body.form;

      try {
        if (user.passwordDigest !== encrypt(password)) {
          ctx.flash.set({ text: 'Wrong password', type: 'alert-danger' });
        } else if (newPassword !== confirmation) {
          ctx.flash.set({ text: 'Password doesn\'t match confirmation', type: 'alert-danger' });
        } else {
          await user.update({ password: newPassword });
          ctx.flash.set({ text: 'Password has been updated', type: 'alert-success' });
        }
      } catch (e) {
        ctx.flash.set({ text: 'New password is not valid', type: 'alert-danger' });
      }

      ctx.redirect(router.url('usersEditPassword'));
    })

    .delete('usersDelete', '/users/current', async (ctx) => {
      const id = ctx.session.userId;
      if (id) {
        await User.destroy({ where: { id } });
        ctx.session = {};
        ctx.flash.set({ text: 'User account was deleted', type: 'alert-success' });
      }
      ctx.redirect(router.url('root'));
    });
};
