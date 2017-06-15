import buildFormObj from '../lib/formObjectBuilder';
import encrypt from '../lib/secure';

export default (router, { User }) => {
  router
    .get('accountEdit', '/account/user/edit', async (ctx) => {
      const id = ctx.session.userId;
      if (!id) {
        ctx.redirect(router.url('sessionNew'));
        return;
      }
      const user = await User.findById(id);
      ctx.render('account/edit', { f: buildFormObj(user), user });
    })


    .get('accountChangePassword', '/account/password/edit', async (ctx) => {
      const id = ctx.session.userId;
      if (!id) {
        ctx.redirect(router.url('sessionNew'));
        return;
      }
      const user = await User.findById(id);
      ctx.render('account/change_password', { f: buildFormObj({}), user });
    })


    .put('accountUpdateData', '/account/user', async (ctx) => {
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
        ctx.redirect(router.url('accountEdit'));
      } catch (e) {
        ctx.render('account/edit', { f: buildFormObj(form, e), user });
      }
    })


    .put('accountUpdatePassword', '/account/password', async (ctx) => {
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

      ctx.redirect(router.url('accountChangePassword'));
    })


    .delete('accountDelete', '/account', async (ctx) => {
      const id = ctx.session.userId;
      if (id) {
        await User.destroy({ where: { id } });
        ctx.session = {};
        ctx.flash.set({ text: 'User account was deleted', type: 'alert-success' });
      }
      ctx.redirect(router.url('root'));
    });
};
