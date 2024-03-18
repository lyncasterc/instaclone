import supertest from 'supertest';
import jwt, { JwtPayload } from 'jsonwebtoken';
import app from '../src/app';
import testHelpers from './helpers/test-helpers';
import { testMongodb } from '../src/mongo';
import { User } from '../src/types';
import config from '../src/utils/config';

const api = supertest(app);
const LOGIN_URL = '/api/auth/login';
const REFRESH_URL = '/api/auth/refresh';
const { JWT_SECRET } = config;

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
      .post(LOGIN_URL)
      .send({ username: testUser.username, password: 'secret' })
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('responds with the access token', async () => {
    const response = await api
      .post(LOGIN_URL)
      .send({ username: testUser.username, password: 'secret' });

    expect(response.body.accessToken).toBeDefined();
  });

  test('decoded access token contains username and id', async () => {
    const response = await api
      .post(LOGIN_URL)
      .send({ username: testUser.username, password: 'secret' });

    const decodedToken = jwt.verify(
      response.body.accessToken,
      JWT_SECRET || '',
    ) as JwtPayload;

    expect(decodedToken).toBeDefined();
    expect(decodedToken.id).toBe(testUser.id);
    expect(decodedToken.username).toBe(testUser.username);
  });

  test('sets a cookie with the refresh token', async () => {
    const response = await api
      .post(LOGIN_URL)
      .send({ username: testUser.username, password: 'secret' });

    const refreshTokenCookie = response.header['set-cookie'][0];

    expect(refreshTokenCookie).toBeDefined();
    expect(refreshTokenCookie).toMatch(/refreshToken=/);

    const refreshToken = refreshTokenCookie.split(';')[0].split('=')[1];
    const decodedToken = jwt.verify(
      refreshToken,
      JWT_SECRET || '',
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
      .post(LOGIN_URL)
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
      .post(LOGIN_URL)
      .send(invalidLoginInfo)
      .expect(401)
      .expect('Content-Type', /application\/json/);

    expect(response.body.error).toMatch(/invalid username or password/i);
  });

  test('does not set a cookie with the refresh token', async () => {
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
      .post(LOGIN_URL)
      .send(invalidLoginInfo)
      .expect(401)
      .expect('Content-Type', /application\/json/);

    expect(response.headers['set-cookie']).toBeUndefined();
  });
});

describe('successful token refresh', () => {
  let refreshTokenCookie: string;

  beforeEach(async () => {
    testUser = await testHelpers.createTestUser({
      username: 'admin',
      fullName: 'Bobby Bo',
      email: 'bobby@email.com',
      password: 'secret',
    });

    const response = await api
      .post(LOGIN_URL)
      .send({ username: testUser.username, password: 'secret' })
      .expect(200);

    [refreshTokenCookie] = response.header['set-cookie'];
  });

  test('responds with 200 code and returns JSON', async () => {
    await api
      .post('/api/auth/refresh')
      .expect(200)
      .set('Cookie', refreshTokenCookie)
      .expect('Content-Type', /application\/json/);
  });

  test('responds with a new access token', async () => {
    const response = await api
      .post('/api/auth/refresh')
      .set('Cookie', refreshTokenCookie);

    expect(response.body.accessToken).toBeDefined();
  });

  test('decoded access token contains username and id', async () => {
    const response = await api
      .post('/api/auth/refresh')
      .set('Cookie', refreshTokenCookie);

    const decodedToken = jwt.verify(
      response.body.accessToken,
      JWT_SECRET || '',
    ) as JwtPayload;

    expect(decodedToken).toBeDefined();
    expect(decodedToken.id).toBe(testUser.id);
    expect(decodedToken.username).toBe(testUser.username);
  });
});

describe('unsuccessful token refresh', () => {
  test('responds with 401 code if no refresh token is sent', async () => {
    await api
      .post(REFRESH_URL)
      .expect(401);
  });

  test('returns no access token', async () => {
    const response = await api
      .post(REFRESH_URL)
      .expect(401);

    expect(response.body.accessToken).toBeUndefined();
  });

  test('responds with 401 code if invalid refresh token is sent', async () => {
    await api
      .post(REFRESH_URL)
      .set('Cookie', 'refreshToken=invalidtoken')
      .expect(401);
  });

  test('responds with 401 code if expired refresh token is sent', async () => {
    const expiredToken = jwt.sign(
      { id: '123', username: 'test' },
      JWT_SECRET || '',
      { expiresIn: -1 },
    );

    await api
      .post(REFRESH_URL)
      .set('Cookie', `refreshToken=${expiredToken}`)
      .expect(401);
  });
});

describe('logout', () => {
  let refreshTokenCookie: string;

  beforeEach(async () => {
    testUser = await testHelpers.createTestUser({
      username: 'admin',
      fullName: 'Bobby Bo',
      email: 'bobby@email.com',
      password: 'secret',
    });

    const response = await api
      .post(LOGIN_URL)
      .send({ username: testUser.username, password: 'secret' })
      .expect(200);

    [refreshTokenCookie] = response.header['set-cookie'];
  });

  test('responds with 204 code', async () => {
    await api
      .post('/api/auth/logout')
      .set('Cookie', refreshTokenCookie)
      .expect(204);
  });

  test('clears the refresh token cookie', async () => {
    const response = await api
      .post('/api/auth/logout')
      .set('Cookie', refreshTokenCookie);

    const setCookieHeader = response.headers['set-cookie'];

    expect(setCookieHeader).toBeDefined();
    expect(setCookieHeader[0]).toMatch(/refreshToken=;/);
  });
});
