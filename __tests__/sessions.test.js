import request from 'supertest';
import matchers from 'jest-supertest-matchers';
import faker from 'faker';

import app from '../src';
import connect from '../src/db';
import getUser from '../src/models/User';
import encrypt from '../src/lib/secure';

describe('Sessions', () => {
  const User = getUser(connect);
  const hasUser = async (info) => {
    const user = await User.findOne({
      where: {
        email: info.email,
        firstName: info.firstName,
        lastName: info.lastName,
        passwordDigest: encrypt(info.password),
      },
    });

    return user !== null;
  };

  let server;

  let email;
  let firstName;
  let lastName;
  let password;

  beforeAll(async () => {
    // await User.destroy({ where: {} });
    jasmine.addMatchers(matchers);

    email = faker.internet.email();
    firstName = faker.name.firstName();
    lastName = faker.name.lastName();
    password = faker.internet.password();
  });

  beforeEach(() => {
    server = app().listen();
  });

  it('Sign Up', async () => {
    const form = { email, firstName, lastName, password };
    const countBefore = await User.count();

    const res = await request.agent(server)
      .post('/users')
      .send({ form });
    expect(res).toHaveHTTPStatus(302);

    const countAfter = await User.count();
    expect(countAfter).toBe(countBefore + 1);
    expect(await hasUser(form)).toBe(true);
  });

  it('Sign In', async () => {
    const form = { email, password };
    const res = await request.agent(server)
      .post('/session')
      .send({ form });
    expect(res).toHaveHTTPStatus(302);
  });

  it('Sign in (wrong password)', async () => {
    const wrongPassword = faker.internet.password();
    const form = { email, password: wrongPassword };
    const res = await request.agent(server)
      .post('/session')
      .send({ form });
    expect(res).toHaveHTTPStatus(302);
  });

  it('Sign Out', async () => {
    const res = await request.agent(server)
      .delete('/session');
    expect(res).toHaveHTTPStatus(302);
  });

  afterEach((done) => {
    server.close();
    done();
  });

  afterAll(async () => {
    // await User.destroy({ where: {} });
  });
});
