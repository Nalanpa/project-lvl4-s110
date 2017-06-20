import request from 'supertest';
import matchers from 'jest-supertest-matchers';
import Router from 'koa-router';
import container from '../src/container';
import addRoutes from '../src/controllers';

import app from '../src';

describe('requests', () => {
  let server;
  const router = new Router();
  addRoutes(router, container);

  beforeAll(() => {
    jasmine.addMatchers(matchers);
  });

  beforeEach(() => {
    server = app().listen();
  });

  it('Routes', async () => {
    const res1 = await request.agent(server)
      .get(router.url('root'));
    const res2 = await request.agent(server)
      .get(router.url('usersIndex'));
    const res3 = await request.agent(server)
      .get(router.url('usersNew'));
    const res4 = await request.agent(server)
      .get(router.url('accountEdit'));
    const res5 = await request.agent(server)
      .get(router.url('accountChangePassword'));
    const res6 = await request.agent(server)
      .get(router.url('sessionNew'));

    expect(res1).toHaveHTTPStatus(200);
    expect(res2).toHaveHTTPStatus(200);
    expect(res3).toHaveHTTPStatus(200);
    expect(res4).toHaveHTTPStatus(302);
    expect(res5).toHaveHTTPStatus(302);
    expect(res6).toHaveHTTPStatus(200);
  });

  it('GET 404', async () => {
    const res = await request.agent(server)
      .get('/wrong-path');
    expect(res).toHaveHTTPStatus(404);
  });

  afterEach((done) => {
    server.close();
    done();
  });
});
