import buildFormObj from '../lib/formObjectBuilder';
import encrypt from '../lib/secure';

export default (router, { User }) => {
  router
    .get('account', '/current/account', async (ctx) => {
      const id = ctx.session.userId;
      if (!id) {
        ctx.redirect(router.url('newSession'));
        return;
      }

      const user = await User.findById(id);
      ctx.render('account', { f: buildFormObj(user), user });
    })
    .post('account', '/current/account', async (ctx) => {
      const id = ctx.session.userId;
      if (!id) {
        ctx.redirect(router.url('newSession'));
        return;
      }

      const user = await User.findById(id);
      const form = ctx.request.body.form;
      try {
        await user.update(form);
        ctx.flash.set({ text: 'User has been updated', type: 'alert-success' });
        ctx.redirect(router.url('account'));
      } catch (e) {
        ctx.render('account', { f: buildFormObj(form, e), user });
      }
    })
    .get('password', '/current/password', async (ctx) => {
      const id = ctx.session.userId;
      if (!id) {
        ctx.redirect(router.url('newSession'));
        return;
      }

      const user = await User.findById(id);
      ctx.render('account/password', { f: buildFormObj({}), user });
    })
    .post('password', '/current/password', async (ctx) => {
      const id = ctx.session.userId;
      if (!id) {
        ctx.redirect(router.url('newSession'));
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

      ctx.redirect(router.url('password'));
    })
    .get('deleteAccount', '/current/ask_delete', async (ctx) => {
      const id = ctx.session.userId;
      if (!id) {
        ctx.redirect(router.url('newSession'));
        return;
      }

      const user = await User.findById(id);
      ctx.render('account/delete', { f: buildFormObj({}), user });
    })
    .delete('account', '/current/account', async (ctx) => {
      const id = ctx.session.userId;
      if (id) {
        await User.destroy({ where: { id } });
        ctx.session = {};
        ctx.flash.set({ text: 'User account was deleted', type: 'alert-success' });
      }
      ctx.redirect(router.url('root'));
    });
};
