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

  it('Add and delete', async () => {
    const name = faker.random.word();
    const form = { name };
    const countBefore = await TaskStatus.count();

    console.log('Statuses count >>> ', countBefore);

    const res = await request.agent(server)
      .post('/taskStatuses')
      .send({ form });
    expect(res).toHaveHTTPStatus(302);

    const countAfter = await TaskStatus.count();
    expect(countAfter).toBe(countBefore + 1);

    const taskStatus = await TaskStatus.findOne({
      where: { name },
    });
    expect(taskStatus.name).toBe(name);

    const resDel = await request.agent(server)
      .delete(`/taskStatuses/${name}`);
    expect(resDel).toHaveHTTPStatus(302);
  });

  afterEach((done) => {
    server.close();
    done();
  });

  afterAll(async () => {
    // await TaskStatus.destroy({ where: {} });
  });
});
