export default async (ctx, next) => {
  const id = ctx.session.userId;
  if (!id) {
    ctx.flash.set({ text: 'Please sign in first', type: 'alert-info' });
    ctx.redirect('/session');
    return;
  }
  await next();
};
