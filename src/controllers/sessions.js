import buildFormObj from '../lib/formObjectBuilder';
import encrypt from '../lib/secure';

export default (router, { User }) => {
  router
    .get('newSession', '/session/new', async (ctx) => {
      const data = {};
      ctx.render('sessions/new', { f: buildFormObj(data) });
    })
    .post('session', '/session', async (ctx) => {
      const { email, password } = ctx.request.body.form;
      const user = await User.findOne({
        where: {
          email,
        },
      });
      if (user && user.passwordDigest === encrypt(password)) {
        ctx.session.userId = user.id;
        ctx.redirect(router.url('root'));
        return;
      }
      console.log('Session error >>>', email, password);

      if (!email || !password) {
        ctx.flash.set({ text: 'Please fill in your Email and Password', type: 'alert-danger' });
      } else {
        ctx.flash.set({ text: 'Email or password were wrong', type: 'alert-danger' });
      }

      ctx.redirect(router.url('newSession'));
    })
    .get('confirmLogout', '/session/confirmLogout', async (ctx) => {
      ctx.render('sessions/logout', { f: buildFormObj({}) });
    })
    .delete('session', '/session', (ctx) => {
      ctx.session = {};
      ctx.redirect(router.url('root'));
    });
};
