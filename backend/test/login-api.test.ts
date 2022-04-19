import supertest from 'supertest';
import jwt, { JwtPayload } from 'jsonwebtoken';
import app from '../src/app';
import testHelpers from './helpers/test-helpers';
import { testMongodb } from '../src/mongo';
import { User } from '../src/types';

const api = supertest(app);

beforeAll(async () => { await testMongodb.connect(); });
beforeEach(async () => { await testMongodb.clear(); });
afterAll(async () => { await testMongodb.close(); });

let testUser: User;

describe('successful login', () => {
  beforeEach(async () => {
    testUser = await testHelpers.createTestUser({
      username: 'admin',
      fullName: 'Bobby Bo',
      email: 'bobby@email.com',
      password: 'secret',
    });
  });

  test('responds with 200 code and returns JSON', async () => {
    await api
      .post('/api/login')
      .send({ username: testUser.username, password: 'secret' })
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('responds with the token', async () => {
    const response = await api
      .post('/api/login')
      .send({ username: testUser.username, password: 'secret' });

    expect(response.body.token).toBeDefined();
  });

  test('decoded token contains username and id', async () => {
    const response = await api
      .post('/api/login')
      .send({ username: testUser.username, password: 'secret' });

    const decodedToken = jwt.verify(
      response.body.token,
      process.env.SECRET as string,
    ) as JwtPayload;

    expect(decodedToken).toBeDefined();
    expect(decodedToken.id).toBe(testUser.id);
    expect(decodedToken.username).toBe(testUser.username);
  });
});

describe('unsuccessful login', () => {
  test('login with non-existing username fails with 401 error code', async () => {
    const nonExistingUser = {
      username: 'i dont exist',
      password: 'i also dont exist',
    };

    const response = await api
      .post('/api/login')
      .send(nonExistingUser)
      .expect(401)
      .expect('Content-Type', /application\/json/);
    expect(response.body.error).toMatch(/invalid username or password/i);
  });

  test('login with wrong password responds with 401 error code', async () => {
    const user = await testHelpers.createTestUser({
      username: 'admin',
      fullName: 'Bobby Bo',
      email: 'bobby@email.com',
      password: 'secret',
    });

    const invalidLoginInfo = {
      username: user.username,
      password: 'wrong password',
    };

    const response = await api
      .post('/api/login')
      .send(invalidLoginInfo)
      .expect(401)
      .expect('Content-Type', /application\/json/);

    expect(response.body.error).toMatch(/invalid username or password/i);
  });
});
