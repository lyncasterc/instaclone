import supertest from 'supertest';
import app from '../src/app';
import { testMongodb, Post } from '../src/mongo';
import testHelpers from './helpers/test-helpers';
import testDataUri from './helpers/test-data-uri';
import { User } from '../src/types';

const api = supertest(app);
let token: string;
let testUser: User;

beforeAll(async () => { await testMongodb.connect(); });
beforeEach(async () => {
  await testMongodb.clear();
  testUser = await testHelpers.createTestUser({
    username: 'bobbybo1',
    fullName: 'Bobby Bo',
    email: 'bobby@email.com',
    password: 'secret',
  });

  const response = await api
    .post('/api/login')
    .send({
      username: testUser.username,
      password: 'secret',
    });

  token = response.body.token;

  const initialPosts = [
    {
      creator: testUser.id,
      caption: 'A super cool caption.',
      image: {
        url: 'fakeurl.com',
        publicId: 'fakepublicid',
      },
    },
    {
      creator: testUser.id,
      caption: 'Another super cool caption.',
      image: {
        url: 'anotherfakeurl.com',
        publicId: 'anotherfakepublicid',
      },
    },

  ];

  const postObjects = initialPosts.map((post) => new Post(post));
  const promiseArray = postObjects.map((post) => post.save());
  await Promise.all(promiseArray);
});
afterAll(async () => { await testMongodb.close(); });

describe('when there are posts in the database', () => {
  describe('when getting one post', () => {
    test('request without token fails with 401 error code ', async () => {
      const targetPost = (await testHelpers.postsInDB())[0];

      const response = await api
        .get(`/api/posts/${targetPost.id}`)
        .expect(401)
        .expect('Content-Type', /application\/json/);

      expect(response.body.error).toMatch(/token missing or invalid/i);
    });

    test('post is returned in JSON', async () => {
      const targetPost = (await testHelpers.postsInDB())[0];

      await api
        .get(`/api/posts/${targetPost.id}`)
        .set('Authorization', `bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/);
    });

    test('correct post is returned', async () => {
      const targetPost = (await testHelpers.postsInDB())[0];

      const response = await api
        .get(`/api/posts/${targetPost.id}`)
        .set('Authorization', `bearer ${token}`)
        .expect(200);

      const fetchedPost = response.body;

      expect(targetPost.id).toBe(fetchedPost.id);
      expect(targetPost.caption).toBe(fetchedPost.caption);
    });

    // TODO: write test checking that image is populated, (potentially other fields in the future)
  });

  describe('when creating posts', () => {
    test('request without token fails with 401 error code.', async () => {
      const response = await api
        .post('/api/posts')
        .expect(401)
        .send({
          caption: 'caption',
          imageDataUrl: testDataUri,
        })
        .expect('Content-Type', /application\/json/);

      expect(response.body.error).toMatch(/token missing or invalid/i);
    });

    test('request with missing image field fails with 400 error code', async () => {
      const invalidPostFields = {
        caption: 'caption',
      };

      const response = await api
        .post('/api/posts')
        .send(invalidPostFields)
        .set('Authorization', `bearer ${token}`)
        .expect(400);

      expect(response.body.error).toMatch(/missing image/i);
    });

    test('request with no caption succeeds with 201 code', async () => {
      const startPosts = await testHelpers.postsInDB();
      const validPostFields = {
        imageDataUrl: testDataUri,
      };

      await api
        .post('/api/posts')
        .send(validPostFields)
        .set('Authorization', `bearer ${token}`)
        .expect(201);

      const posts = await testHelpers.postsInDB();
      expect(posts).toHaveLength(startPosts.length + 1);
    });

    test('request with empty caption succeeds with 201 code', async () => {
      const startPosts = await testHelpers.postsInDB();
      const validPostFields = {
        imageDataUrl: testDataUri,
        caption: '',
      };

      await api
        .post('/api/posts')
        .send(validPostFields)
        .set('Authorization', `bearer ${token}`)
        .expect(201);

      const posts = await testHelpers.postsInDB();
      expect(posts).toHaveLength(startPosts.length + 1);
    });

    test('can post a valid post', async () => {
      const startPosts = await testHelpers.postsInDB();
      const validPostFields = {
        caption: 'blue square',
        imageDataUrl: testDataUri,
      };
      await api
        .post('/api/posts')
        .send(validPostFields)
        .set('Authorization', `bearer ${token}`)
        .expect(201);

      const endPosts = await testHelpers.postsInDB();

      expect(endPosts).toHaveLength(startPosts.length + 1);
    });
  });

  describe('when updating posts', () => {
    test('request without token fails with 401 error code', async () => {
      const targetPost = (await testHelpers.postsInDB())[0];
      const updatedPostFields = {
        caption: 'new caption',
      };

      const response = await api
        .put(`/api/posts/${targetPost.id}`)
        .send(updatedPostFields)
        .expect(401)
        .expect('Content-Type', /application\/json/);

      expect(response.body.error).toMatch(/token missing or invalid/i);
    });

    test('when updating the caption and user making request is not creator of post, fails with 401 error code', async () => {
      const targetPost = (await testHelpers.postsInDB())[0];
      const differentUser = await testHelpers.createTestUser({
        username: 'dobbybo',
        email: 'b@email.com',
        fullName: 'Dob Bob',
        password: 'secret',
      });

      const tokenResponse = await api
        .post('/api/login')
        .send({
          username: differentUser.username,
          password: 'secret',
        });

      const wrongUserToken = tokenResponse.body.token;

      const updatedPostFields = {
        caption: 'new caption',
      };

      const response = await api
        .put(`/api/posts/${targetPost.id}`)
        .send(updatedPostFields)
        .set('Authorization', `bearer ${wrongUserToken}`)
        .expect(401)
        .expect('Content-Type', /application\/json/);

      expect(response.body.error).toMatch(/unauthorized/i);
    });

    test('valid request succeeds with 200 code', async () => {
      const targetPost = (await testHelpers.postsInDB())[0];

      const updatedPostFields = {
        caption: 'new caption',
      };

      await api
        .put(`/api/posts/${targetPost.id}`)
        .send(updatedPostFields)
        .set('Authorization', `bearer ${token}`)
        .expect(200);
    });

    test('valid request returns updated post', async () => {
      const targetPost = (await testHelpers.postsInDB())[0];

      const updatedPostFields = {
        caption: 'new caption',
      };

      const response = await api
        .put(`/api/posts/${targetPost.id}`)
        .send(updatedPostFields)
        .set('Authorization', `bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      const returnedPost = response.body;

      expect(returnedPost.caption).toBe(updatedPostFields.caption);
    });

    // TODO: update this for other populated creator/comment fields that may be needed?
    test('returned updated post has populated creator', async () => {
      const targetPost = (await testHelpers.postsInDB())[0];

      const updatedPostFields = {
        caption: 'new caption',
      };

      const response = await api
        .put(`/api/posts/${targetPost.id}`)
        .send(updatedPostFields)
        .set('Authorization', `bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      const returnedPost = response.body;

      expect(returnedPost.creator.username).toBeDefined();

      expect(returnedPost.creator.username).toBe(testUser.username);
    });
  });
});
