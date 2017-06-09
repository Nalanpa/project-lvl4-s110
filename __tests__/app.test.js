import request from 'supertest';
import matchers from 'jest-supertest-matchers';

import app from '../src';

describe('requests', () => {
  let server;

  beforeAll(() => {
    jasmine.addMatchers(matchers);
  });

  beforeEach(() => {
    server = app().listen();
  });

  it('Routes', async () => {
    const res1 = await request.agent(server)
      .get('/');
    const res2 = await request.agent(server)
      .get('/users');
    const res3 = await request.agent(server)
      .get('/users/current/edit/data');
    const res4 = await request.agent(server)
      .get('/users/current/edit/password');
    const res5 = await request.agent(server)
      .get('/users/new');
    const res6 = await request.agent(server)
      .get('/session');

    expect(res1).toHaveHTTPStatus(200);
    expect(res2).toHaveHTTPStatus(200);
    expect(res3).toHaveHTTPStatus(302);
    expect(res4).toHaveHTTPStatus(302);
    expect(res5).toHaveHTTPStatus(200);
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
