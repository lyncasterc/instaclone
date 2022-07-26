import supertest from 'supertest';
import bcrypt from 'bcrypt';
import app from '../src/app';
import { testMongodb, User } from '../src/mongo';
import testHelpers from './helpers/test-helpers';
import { User as UserType } from '../src/types';
import testDataUri from './helpers/test-data-uri';

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

  describe('When updating a user', () => {
    let targetUser: UserType;
    let token: string;
    jest.setTimeout(15000);

    beforeEach(async () => {
      // eslint-disable-next-line prefer-destructuring
      targetUser = (await testHelpers.usersInDB())[0];

      const response = await api
        .post('/api/login')
        .send({
          username: targetUser.username,
          password: 'secret',
        });

      token = response.body.token;
    });

    test('update request without token fails with 401 error code', async () => {
      const updatedUserFields = {
        username: 'bobbybo',
      };

      const response = await api
        .put(`/api/users/${targetUser.id}`)
        .send(updatedUserFields)
        .expect(401)
        .expect('Content-Type', /application\/json/);

      expect(response.body.error).toContain('token missing or invalid.');
      expect(targetUser.username).not.toBe(updatedUserFields.username);
    });

    test('if the user id request parameter and token id do not match when request is updating protected information, fails with 401 error code', async () => {
      const ids = (await testHelpers.usersInDB()).map((user) => user.id);
      const differentId = ids.find((id) => id !== targetUser.id);

      const updatedUserFields = {
        username: 'bobbybo',
      };

      const response = await api
        .put(`/api/users/${differentId}`)
        .send(updatedUserFields)
        .set('Authorization', `bearer ${token}`)
        .expect(401);

      expect(response.body.error).toMatch(/unauthorized/i);
    });

    test('updating user with valid updates and token succeeds with 200 code', async () => {
      const updatedUserFields = {
        username: 'bobbybo',
      };

      const response = await api
        .put(`/api/users/${targetUser.id}`)
        .send(updatedUserFields)
        .set('Authorization', `bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      const returnedUser = response.body;
      expect(returnedUser.username).toEqual(updatedUserFields.username);
    });

    test('updating password should update the user passwordHash field with encypted new password', async () => {
      const updatedUserFields = {
        password: 'coolnewpassword',
      };

      const response = await api
        .put(`/api/users/${targetUser.id}`)
        .send(updatedUserFields)
        .set('Authorization', `bearer ${token}`)
        .expect(200);

      const returnedUser = response.body;
      const isPasswordUpdated = await bcrypt.compare(
        updatedUserFields.password,
        returnedUser.passwordHash,
      );

      expect(isPasswordUpdated).toBe(true);
    });

    test('user can not follow themselves', async () => {
      const response = await api
        .put(`/api/users/${targetUser.id}/follow`)
        .set('Authorization', `bearer ${token}`)
        .expect(400);

      const nonUpdatedUser = (await testHelpers.usersInDB())
        .find((user) => user.id === targetUser.id);

      expect(response.body.error).toMatch(/you can't follow yourself/i);
      expect(nonUpdatedUser.followers).toHaveLength(0);
    });

    test('user can not follow user they already follow', async () => {
      const users = (await testHelpers.usersInDB());
      const differentUser = users.find((user) => user.id !== targetUser.id);

      await api
        .put(`/api/users/${differentUser.id}/follow`)
        .set('Authorization', `bearer ${token}`)
        .expect(200);

      const response = await api
        .put(`/api/users/${differentUser.id}/follow`)
        .set('Authorization', `bearer ${token}`)
        .expect(400);

      expect(response.body.error).toMatch(/you already follow that user/i);
    });

    test('user can be followed', async () => {
      const users = (await testHelpers.usersInDB());
      const differentUser = users.find((user) => user.id !== targetUser.id);

      const response = await api
        .put(`/api/users/${differentUser.id}/follow`)
        .set('Authorization', `bearer ${token}`)
        .expect(200);

      const returnedUser = response.body;

      expect(returnedUser.followers).toHaveLength(1);
      expect(returnedUser.followers[0].id).toBe(targetUser.id);
    });

    test('following a user adds that user to the requesting user following list', async () => {
      const users = (await testHelpers.usersInDB());
      const differentUser = users.find((user) => user.id !== targetUser.id);

      await api
        .put(`/api/users/${differentUser.id}/follow`)
        .set('Authorization', `bearer ${token}`)
        .expect(200);

      const updatedTargetUser = (await testHelpers.usersInDB())
        .find((user) => user.id === targetUser.id);

      expect(updatedTargetUser.following).toHaveLength(1);
      expect(updatedTargetUser.following[0].toString()).toBe(differentUser.id.toString());
    });
  });

  // TODO: Write tests to check if comment fields are populated when fetching user/users.

  describe('When user creates a post', () => {
    let targetUser: UserType;

    beforeEach(async () => {
      // eslint-disable-next-line prefer-destructuring
      targetUser = (await testHelpers.usersInDB())[0];
      const post = {
        caption: 'a blue, square',
        imageDataUrl: testDataUri,
      };

      const response = await api
        .post('/api/login')
        .send({ username: targetUser.username, password: 'secret' });

      const { token } = response.body;

      await api
        .post('/api/posts')
        .set('Authorization', `bearer ${token}`)
        .send(post);
    });

    test('post is added to the user posts array', async () => {
      const response = await api
        .get(`/api/users/${targetUser.id}`)
        .expect(200);

      const fetchedUser = response.body;
      expect(fetchedUser.posts).toHaveLength(1);
    });

    // TODO: update this as needed as you decide what exactly needs to be populated.
    test('fetched user has a populated posts array', async () => {
      const response = await api
        .get(`/api/users/${targetUser.id}`)
        .expect(200);

      const fetchedUser = response.body;
      expect(fetchedUser.posts).toBeDefined();

      const userPost = fetchedUser.posts[0];

      expect(userPost.image).toBeDefined();
      expect(typeof userPost.image.url).toBe('string');
      expect(typeof userPost.image.publicId).toBe('string');
      expect(userPost.image.url).toMatch(/https:\/\/res.cloudinary.com/);
    });
  });

  test('user profile image can be posted and deleted', async () => {
    const initalUser = (await testHelpers.usersInDB())[0];
    const tokenResponse = await api
      .post('/api/login')
      .send({
        username: initalUser.username,
        password: 'secret',
      });
    const { token } = tokenResponse.body;

    await api
      .put(`/api/users/${initalUser.id}`)
      .set('Authorization', `bearer ${token}`)
      .send({ imageDataUrl: testDataUri })
      .expect(200);

    const userWithImage = (await testHelpers.usersInDB()).find((user) => user.id === initalUser.id);

    expect(userWithImage.image).toBeDefined();
    expect(typeof userWithImage.image.url).toBe('string');
    expect(typeof userWithImage.image.publicId).toBe('string');

    await api
      .delete(`/api/users/${initalUser.id}/image`)
      .set('Authorization', `bearer ${token}`)
      .expect(204);

    const endUser = (await testHelpers.usersInDB()).find((user) => user.id === initalUser.id);

    expect(endUser.image).toBeNull();
  });
});
