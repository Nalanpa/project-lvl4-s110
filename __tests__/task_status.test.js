import request from 'supertest';
import matchers from 'jest-supertest-matchers';
import faker from 'faker';

import app from '../src';
import connect from '../src/db';
import getTaskStatus from '../src/models/TaskStatus';

describe('Task Statuses', () => {
  const TaskStatus = getTaskStatus(connect);

  let server;

  beforeAll(async () => {
    jasmine.addMatchers(matchers);
  });

  beforeEach(() => {
    server = app().listen();
  });

  it('GET 200', async () => {
    const res = await request.agent(server)
      .get('/taskStatuses');

    expect(res).toHaveHTTPStatus(200);
  });

  it('Add new status', async () => {
    const name = faker.random.word();
    const form = { name };
    const countBefore = await TaskStatus.count();

    console.log('Statuses count >>> ', countBefore);

    const res = await request.agent(server)
      .post('/taskStatus')
      .send({ form });
    expect(res).toHaveHTTPStatus(302);

    const countAfter = await TaskStatus.count();
    expect(countAfter).toBe(countBefore + 1);

    const taskStatus = await TaskStatus.findOne({
      where: { name },
    });
    expect(taskStatus.name).toBe(name);

    await TaskStatus.destroy({ where: { name } });
  });

  // it('Sign In', async () => {
  //   const form = { email, password };
  //   const res = await request.agent(server)
  //     .post('/session')
  //     .send({ form });
  //   expect(res).toHaveHTTPStatus(302);
  // });
  //
  // it('Sign in (wrong password)', async () => {
  //   const wrongPassword = faker.internet.password();
  //   const form = { email, password: wrongPassword };
  //   const res = await request.agent(server)
  //     .post('/session')
  //     .send({ form });
  //   expect(res).toHaveHTTPStatus(302);
  // });
  //
  // it('Sign Out', async () => {
  //   const res = await request.agent(server)
  //     .delete('/session');
  //   expect(res).toHaveHTTPStatus(302);
  // });

  afterEach((done) => {
    server.close();
    done();
  });

  afterAll(async () => {
    // await TaskStatus.destroy({ where: {} });
  });
});
