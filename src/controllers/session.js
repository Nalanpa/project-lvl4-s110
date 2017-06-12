import buildFormObj from '../lib/formObjectBuilder';
import encrypt from '../lib/secure';

export default (router, { User }) => {
  router
    .get('sessionNew', '/session', async (ctx) => {
      const data = {};
      ctx.render('session/new', { f: buildFormObj(data) });
    })

    .post('sessionCreate', '/session', async (ctx) => {
      const { email, password } = ctx.request.body.form;
      const user = await User.findOne({
        where: { email },
      });
      if (user && user.passwordDigest === encrypt(password)) {
        ctx.session.userId = user.id;
        ctx.session.userName = user.fullName;
        ctx.redirect(router.url('root'));
        return;
      }
      if (!email || !password) {
        ctx.flash.set({ text: 'Please fill in your Email and Password', type: 'alert-danger' });
      } else {
        ctx.flash.set({ text: 'Email or password were wrong', type: 'alert-danger' });
      }
      ctx.redirect(router.url('sessionNew'));
    })

    .delete('sessionDelete', '/session', async (ctx) => {
      const id = ctx.session.userId;
      const user = await User.findById(id);
      const userName = user ? user.fullName : 'see you later';
      ctx.session = {};
      ctx.flash.set({ text: `Good buy, ${userName}!`, type: 'alert-info' });
      ctx.redirect(router.url('root'));
    });
};
