import supertest from 'supertest';
import bcrypt from 'bcrypt';
import app from '../src/app';
import { testMongodb, User } from '../src/mongo';
import testHelpers from './test-helpers';

const api = supertest(app);

beforeAll(async () => { await testMongodb.connect(); });
beforeEach(async () => {
  const passwordHash = await bcrypt.hash('secret', 10);

  const initialUsers = [
    {
      fullName: 'Bob Dob',
      username: 'admin',
      email: 'a@email.com',
      passwordHash,
    },
    {
      fullName: 'Bobby Dobby',
      username: 'nimda',
      email: 'b@email.com',
      passwordHash,
    },
  ];

  const userObjects = initialUsers.map((user) => new User(user));
  const promiseArray = userObjects.map((user) => user.save());
  await Promise.all(promiseArray);
});
afterAll(async () => { await testMongodb.close(); });

describe('When there are multiple users in the database', () => {
  describe('When getting all users', () => {
    test('All users are returned', async () => {
      const startUsers = await testHelpers.usersInDB();
      const response = await api
        .get('/api/users')
        .expect(200);

      const endUsers = response.body;
      expect(endUsers).toHaveLength(startUsers.length);
    });

    test('users are returned as JSON', async () => {
      await api
        .get('/api/users')
        .expect(200)
        .expect('Content-Type', /application\/json/);
    });
  });
});
