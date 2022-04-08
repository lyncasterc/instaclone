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

  // NOTE: the image field in real posts must be in base-64 encoded data url format.
  const initialPosts = [
    {
      creator: testUser.id,
      caption: 'A super cool caption.',
      image: 'fakedataurl',
    },
    {
      creator: testUser.id,
      caption: 'Another super cool caption.',
      image: 'anotherfakedataurl',
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

      await api
        .get(`/api/posts/${targetPost.id}`)
        .expect(401)
        .expect('Content-Type', /application\/json/);
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
  });
});
