import supertest from 'supertest';
import bcrypt from 'bcrypt';
import app from '../src/app';
import { testMongodb, User } from '../src/mongo';
import testHelpers from './test-helpers';

const api = supertest(app);

beforeAll(async () => { await testMongodb.connect(); });
beforeEach(async () => {
  await testMongodb.clear();
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

  describe('When getting a single user by id', () => {
    test('Correct user is retured', async () => {
      const targetUser = (await testHelpers.usersInDB())[0];
      const response = await api
        .get(`/api/users/${targetUser.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      const fetchedUser = response.body;

      expect(fetchedUser).toEqual(targetUser);
    });
  });

  describe('when creating a user', () => {
    test('creating a valid user with a unique username succeeds', async () => {
      const startUsers = await testHelpers.usersInDB();
      const validUser = {
        fullName: 'Bobby Bo',
        username: 'bobby',
        email: 'bobbybo@fakeemail.com',
        password: 'bobbyisthebest',
      };

      await api
        .post('/api/users')
        .send(validUser)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const endUsers = await testHelpers.usersInDB();
      expect(endUsers).toHaveLength(startUsers.length + 1);

      const usernames = endUsers.map((user) => user.username);
      expect(usernames).toContain(validUser.username);
    });

    describe('when the new user being created is invalid', () => {
      test('creating a user with non-unique username fails with 400 code', async () => {
        const startUsers = await testHelpers.usersInDB();
        const invalidUser = {
          fullName: 'Bobby Bo',
          username: 'admin',
          email: 'bobbybo@fakeemail.com',
          password: 'bobbyisthebest',
        };

        const response = await api
          .post('/api/users')
          .send(invalidUser)
          .expect(400);

        const endUsers = await testHelpers.usersInDB();
        expect(endUsers).not.toHaveLength(startUsers.length + 1);

        const errorMessage = response.body.error;
        expect(errorMessage).toContain('That username is already taken!');
      });
    });

    test('creating a user with password less than 5 chars fails with 400 code', async () => {
      const startUsers = await testHelpers.usersInDB();
      const invalidUser = {
        fullName: 'Bobby Bo',
        username: 'bobbybo',
        email: 'bobbybo@fakeemail.com',
        password: 'bo',
      };

      const response = await api
        .post('/api/users')
        .send(invalidUser)
        .expect(400);

      const endUsers = await testHelpers.usersInDB();
      expect(endUsers).not.toHaveLength(startUsers.length + 1);

      const errorMessage = response.body.error;
      expect(errorMessage).toContain('Password is too short!');
    });

    test('creating a user with missing required field fails with 400 code', async () => {
      const startUsers = await testHelpers.usersInDB();
      const invalidUser = {
        username: 'bobbybo',
        email: 'bobbybo@fakeemail.com',
        password: 'bobbyboistehbest',
      };

      const response = await api
        .post('/api/users')
        .send(invalidUser)
        .expect(400);

      const endUsers = await testHelpers.usersInDB();
      expect(endUsers).not.toHaveLength(startUsers.length + 1);

      const errorMessage = response.body.error;
      expect(errorMessage).toMatch(/incorrect or missing/i);
    });
  });
});
