// @flow

import 'babel-polyfill';

import path from 'path';
import Koa from 'koa';
import Pug from 'koa-pug';
import Router from 'koa-router';
import koaLogger from 'koa-logger';
import serve from 'koa-static';
import middleware from 'koa-webpack';
import bodyParser from 'koa-bodyparser';
import session from 'koa-generic-session';
import flash from 'koa-flash-simple';
import _ from 'lodash';
import methodOverride from 'koa-methodoverride';
import rollbar from 'rollbar';

import getWebpackConfig from '../webpack.config.babel';
import addRoutes from './controllers';
import container from './container';

export default () => {
  const app = new Koa();

  app.keys = ['some secret hurr'];

  app.use(session(app));
  app.use(flash());
  app.use(async (ctx, next) => {
    ctx.state = {
      flash: ctx.flash,
      isSignedIn: () => ctx.session.userId !== undefined,
      currentUserName: () => ctx.session.userName || '',
      currentUserId: () => ctx.session.userId,
    };
    await next();
  });
  app.use(bodyParser());
  // eslint-disable-next-line consistent-return
  app.use(methodOverride((req) => {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // eslint-disable-next-line no-underscore-dangle
      return req.body._method;
    }
  }));
  app.use(serve(path.join(__dirname, '..', 'public')));
  app.use(serve(path.join(__dirname, '..', 'public', 'assets')));

  if (process.env.NODE_ENV !== 'test') {
    app.use(middleware({
      config: getWebpackConfig(),
    }));
  }

  app.use(koaLogger());
  const router = new Router();
  addRoutes(router, container);
  app.use(router.allowedMethods());
  app.use(router.routes());

  const pug = new Pug({
    viewPath: path.join(__dirname, 'views'),
    debug: true,
    pretty: true,
    compileDebug: true,
    locals: [],
    basedir: path.join(__dirname, 'views'),
    helperPath: [
      { _ },
      { urlFor: (...args) => router.url(...args) },
      { cutString: (string, length) => (string.length > length ? `${string.substr(0, length)}...` : string) },
      { iconSrc: name => `/assets/${name.toLowerCase()}.png` },
    ],
  });
  pug.use(app);


  rollbar.init(process.env.ROLLBAR_TOKEN);

  app.on('error', (err, ctx) => rollbar.handleError(err, ctx));

  return app;
};
