export default (router, { User }) => {
  router
  .get('root', '/', async (ctx) => {
    const id = ctx.session.userId;
    const user = await User.findById(id);
    ctx.render('welcome', { user });
  })
  .get('about', '/about', (ctx) => {
    ctx.render('welcome/about');
  });
};
