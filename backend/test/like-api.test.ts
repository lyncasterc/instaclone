import supertest from 'supertest';
import app from '../src/app';
import {
  testMongodb,
  Post,
  Comment,
  Like,
  Notification,
} from '../src/mongo';
import testHelpers from './helpers/test-helpers';
import { User } from '../src/types';
import SocketManager from '../src/utils/SocketManager';

const api = supertest(app);
let accessToken: string;
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
    .post('/api/auth/login')
    .send({
      username: testUser.username,
      password: 'secret',
    });

  accessToken = response.body.accessToken;

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

describe('when liking entities', () => {
  test('request without accessToken should fail', async () => {
    const post = await Post.findOne({ creator: testUser.id });

    const response = await api
      .post('/api/likes')
      .send({
        entityId: post.id,
        entityModel: 'Post',
      })
      .expect(401);

    expect(response.body.error).toMatch(/token missing or invalid/i);
  });

  test('liking non-existing entity should fail', async () => {
    const post = await Post.findOne({ creator: testUser.id });
    const entityId = post.id;

    await post.remove();

    const response = await api
      .post('/api/likes')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        entityId,
        entityModel: 'Post',
      })
      .expect(404);

    expect(response.body.error).toMatch(/entity not found/i);
  });

  test('liking an entity with wrong model should fail', async () => {
    const post = await Post.findOne({ creator: testUser.id });
    const entityId = post.id;

    const response = await api
      .post('/api/likes')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        entityId,
        entityModel: 'Comment',
      })
      .expect(404);

    expect(response.body.error).toMatch(/entity not found/i);
  });

  test('liking an entity with invalid model should fail', async () => {
    const post = await Post.findOne({ creator: testUser.id });
    const entityId = post.id;

    const response = await api
      .post('/api/likes')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        entityId,
        entityModel: 'InvalidModel',
      })
      .expect(404);

    expect(response.body.error).toMatch(/entity not found/i);
  });

  test('liking a post entity should succeed', async () => {
    const post = await Post.findOne({ creator: testUser.id });
    const entityId = post.id;

    await api
      .post('/api/likes')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        entityId,
        entityModel: 'Post',
      })
      .expect(201);

    const like = await Like.findOne({ 'likedEntity.id': entityId });

    expect(like).not.toBeNull();
    expect(like.likedEntity.model).toBe('Post');
    expect(like.user.toString()).toBe(testUser.id);
    expect(like.likedEntity.id.toString()).toBe(entityId);
  });

  test('liking a comment entity should succeed', async () => {
    const post = await Post.findOne({ creator: testUser.id });

    const newComment = await Comment.create({
      post: post.id,
      body: 'A new comment',
      author: testUser.id,
    });
    const entityId = newComment.id;

    post.comments = [newComment.id];

    await post.save();

    await api
      .post('/api/likes')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        entityId,
        entityModel: 'Comment',
      })
      .expect(201);

    const like = await Like.findOne({ 'likedEntity.id': entityId });

    expect(like).not.toBeNull();
    expect(like.likedEntity.model).toBe('Comment');
    expect(like.user.toString()).toBe(testUser.id);
    expect(like.likedEntity.id.toString()).toBe(entityId);
  });

  test('liking an entity more than once should fail', async () => {
    const post = await Post.findOne({ creator: testUser.id });
    const entityId = post.id;

    await api
      .post('/api/likes')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        entityId,
        entityModel: 'Post',
      })
      .expect(201);

    const postLikeCount = await Like.countDocuments({ 'likedEntity.id': entityId });

    expect(postLikeCount).toBe(1);

    const response = await api
      .post('/api/likes')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        entityId,
        entityModel: 'Post',
      })
      .expect(400);

    const postLikeCountAfter = await Like.countDocuments({ 'likedEntity.id': entityId });

    expect(postLikeCountAfter).toBe(1);

    expect(response.body.error).toMatch(/can not like the same entity twice/i);
  });
});

describe('when unliking entities', () => {
  test('request without accessToken should fail', async () => {
    const post = await Post.findOne({ creator: testUser.id });
    const entityId = post.id;

    const response = await api
      .delete(`/api/likes/${entityId}`)
      .expect(401);

    expect(response.body.error).toMatch(/token missing or invalid/i);
  });

  test('unliking non-existing entity should not fail', async () => {
    const post = await Post.findOne({ creator: testUser.id });
    const entityId = post.id;

    await post.remove();

    await api
      .delete(`/api/likes/${entityId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(204);
  });

  test('unliking an already unliked entity should not fail', async () => {
    const post = await Post.findOne({ creator: testUser.id });
    const entityId = post.id;

    await api
      .delete(`/api/likes/${entityId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(204);
  });

  test('unliking a post entity should succeed', async () => {
    const post = await Post.findOne({ creator: testUser.id });
    const entityId = post.id;

    await api
      .post('/api/likes')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        entityId,
        entityModel: 'Post',
      })
      .expect(201);

    const postLikeCountBefore = await Like.countDocuments({ 'likedEntity.id': entityId });

    expect(postLikeCountBefore).toBe(1);

    await api
      .delete(`/api/likes/${entityId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(204);

    const postLikeCountAfter = await Like.countDocuments({ 'likedEntity.id': entityId });

    expect(postLikeCountAfter).toBe(0);
  });

  test('unliking a comment entity should succeed', async () => {
    const post = await Post.findOne({ creator: testUser.id });

    const newComment = await Comment.create({
      post: post.id,
      body: 'A new comment',
      author: testUser.id,
    });
    const entityId = newComment.id;

    post.comments = [newComment.id];

    await post.save();

    await api
      .post('/api/likes')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        entityId,
        entityModel: 'Comment',
      })
      .expect(201);

    const commentLikeCountBefore = await Like.countDocuments({ 'likedEntity.id': entityId });

    expect(commentLikeCountBefore).toBe(1);

    await api
      .delete(`/api/likes/${entityId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(204);

    const commentLikeCountAfter = await Like.countDocuments({ 'likedEntity.id': entityId });

    expect(commentLikeCountAfter).toBe(0);
  });

  test('unliking entity twice should not fail', async () => {
    const post = await Post.findOne({ creator: testUser.id });
    const entityId = post.id;

    await api
      .post('/api/likes')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        entityId,
        entityModel: 'Post',
      })
      .expect(201);

    const postLikeCountBefore = await Like.countDocuments({ 'likedEntity.id': entityId });

    expect(postLikeCountBefore).toBe(1);

    await api
      .delete(`/api/likes/${entityId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(204);

    await api
      .delete(`/api/likes/${entityId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(204);

    const postLikeCountAfter = await Like.countDocuments({ 'likedEntity.id': entityId });

    expect(postLikeCountAfter).toBe(0);
  });
});

describe('when getting like count', () => {
  test('getting like count for an entity with likes should succeed', async () => {
    const post = await Post.findOne({ creator: testUser.id });
    const entityId = post.id;

    await api
      .post('/api/likes')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        entityId,
        entityModel: 'Post',
      })
      .expect(201);

    const response = await api
      .get(`/api/likes/${entityId}/likeCount`)
      .expect(200);

    expect(response.body.likeCount).toBe(1);
  });

  test('getting like count for an entity without likes should succeed', async () => {
    const post = await Post.findOne({ creator: testUser.id });
    const entityId = post.id;

    const response = await api
      .get(`/api/likes/${entityId}/likeCount`)
      .expect(200);

    expect(response.body.likeCount).toBe(0);
  });

  test('getting like count for non-existing entity should succeed', async () => {
    const post = await Post.findOne({ creator: testUser.id });
    const entityId = post.id;

    await post.remove();

    const response = await api
      .get(`/api/likes/${entityId}/likeCount`)
      .expect(200);

    expect(response.body.likeCount).toBe(0);
  });
});

describe('when getting like users', () => {
  test('getting like users for non-existing entity should succeed and return empty array', async () => {
    const post = await Post.findOne({ creator: testUser.id });
    const entityId = post.id;

    await post.remove();

    const response = await api
      .get(`/api/likes/${entityId}/likes`)
      .expect(200);

    expect(response.body.likes).toEqual([]);
  });

  test('getting likes for an entity without likes should succeed and return empty array', async () => {
    const post = await Post.findOne({ creator: testUser.id });
    const entityId = post.id;

    const response = await api
      .get(`/api/likes/${entityId}/likes`)
      .expect(200);

    expect(response.body.likes).toEqual([]);
  });

  test('getting likes for an entity with likes should succeed and return array of users', async () => {
    const post = await Post.findOne({ creator: testUser.id });
    const entityId = post.id;

    await api
      .post('/api/likes')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        entityId,
        entityModel: 'Post',
      })
      .expect(201);

    const response = await api
      .get(`/api/likes/${entityId}/likes`)
      .expect(200);

    expect(response.body.likes.length).toBe(1);
    expect(response.body.likes[0].username).toBe(testUser.username);
    expect(response.body.likes[0].id).toBe(testUser.id.toString());
  });
});

describe('when getting has user liked entity', () => {
  test('request without accessToken should fail', async () => {
    const post = await Post.findOne({ creator: testUser.id });
    const entityId = post.id;

    const response = await api
      .get(`/api/likes/${entityId}/hasLiked`)
      .expect(401);

    expect(response.body.error).toMatch(/token missing or invalid/i);
  });

  test('request for non-existing entity should succeed and return false', async () => {
    const post = await Post.findOne({ creator: testUser.id });
    const entityId = post.id;

    await post.remove();

    const response = await api
      .get(`/api/likes/${entityId}/hasLiked`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body.hasLiked).toBe(false);
  });

  test('request for an entity that user has not liked should succeed and return false', async () => {
    const post = await Post.findOne({ creator: testUser.id });
    const entityId = post.id;

    const response = await api
      .get(`/api/likes/${entityId}/hasLiked`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body.hasLiked).toBe(false);
  });

  test('request for an entity user has liked should succeed and return true', async () => {
    const post = await Post.findOne({ creator: testUser.id });
    const entityId = post.id;

    await api
      .post('/api/likes')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        entityId,
        entityModel: 'Post',
      })
      .expect(201);

    const response = await api
      .get(`/api/likes/${entityId}/hasLiked`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body.hasLiked).toBe(true);
  });

  test('request for an entity user has unliked should succeed and return false', async () => {
    const post = await Post.findOne({ creator: testUser.id });
    const entityId = post.id;

    await api
      .post('/api/likes')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        entityId,
        entityModel: 'Post',
      })
      .expect(201);

    await api
      .delete(`/api/likes/${entityId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(204);

    const response = await api
      .get(`/api/likes/${entityId}/hasLiked`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body.hasLiked).toBe(false);
  });

  test('request for an entity that has likes but user has not liked should succeed and return false', async () => {
    const post = await Post.findOne({ creator: testUser.id });
    const entityId = post.id;

    const otherUser = await testHelpers.createTestUser({
      username: 'otheruser',
      fullName: 'Bad Bunny',
      email: 'whatevs@whatevs.com',
      password: 'secret',
    });

    const otherUserToken = (await api
      .post('/api/auth/login')
      .send({
        username: otherUser.username,
        password: 'secret',
      })).body.accessToken;

    // liking the post with the other user

    await api
      .post('/api/likes')
      .set('Authorization', `Bearer ${otherUserToken}`)
      .send({
        entityId,
        entityModel: 'Post',
      })
      .expect(201);

    // checking if the testUser has liked the post

    const response = await api
      .get(`/api/likes/${entityId}/hasLiked`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body.hasLiked).toBe(false);
  });
});

describe('when deleting entities with likes', () => {
  test('deleting a post with likes should delete the likes', async () => {
    const post = await Post.findOne({ creator: testUser.id });
    const entityId = post.id;

    await api
      .post('/api/likes')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        entityId,
        entityModel: 'Post',
      })
      .expect(201);

    const postLikeCountBefore = await Like.countDocuments({ 'likedEntity.id': entityId });

    expect(postLikeCountBefore).toBe(1);

    await api
      .delete(`/api/posts/${entityId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(204);

    const postLikeCountAfter = await Like.countDocuments({ 'likedEntity.id': entityId });

    expect(postLikeCountAfter).toBe(0);
  });

  test('deleting a comment with likes should delete the likes', async () => {
    const post = await Post.findOne({ creator: testUser.id });

    const newComment = await Comment.create({
      post: post.id,
      body: 'A new comment',
      author: testUser.id,
    });

    const entityId = newComment.id;

    post.comments = [newComment.id];

    await post.save();

    await api
      .post('/api/likes')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        entityId,
        entityModel: 'Comment',
      })
      .expect(201);

    const commentLikeCountBefore = await Like.countDocuments({ 'likedEntity.id': entityId });

    expect(commentLikeCountBefore).toBe(1);

    await api
      .delete(`/api/posts/${post.id}/comments/${entityId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(204);

    const commentLikeCountAfter = await Like.countDocuments({ 'likedEntity.id': entityId });

    expect(commentLikeCountAfter).toBe(0);
  });

  test('deleting a post with a liked comment should delete the likes', async () => {
    const post = await Post.findOne({ creator: testUser.id });

    const newComment = await Comment.create({
      post: post.id,
      body: 'A new comment',
      author: testUser.id,
    });

    const entityId = newComment.id;

    post.comments = [newComment.id];

    await post.save();

    await api
      .post('/api/likes')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        entityId,
        entityModel: 'Comment',
      })
      .expect(201);

    const commentLikeCountBefore = await Like.countDocuments({ 'likedEntity.id': entityId });

    expect(commentLikeCountBefore).toBe(1);

    await api
      .delete(`/api/posts/${post.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(204);

    const commentLikeCountAfter = await Like.countDocuments({ 'likedEntity.id': entityId });

    expect(commentLikeCountAfter).toBe(0);
  });

  test('deleting a parent comment with a liked reply should delete the likes', async () => {
    const post = await Post.findOne({ creator: testUser.id });

    const parentComment = await Comment.create({
      post: post.id,
      body: 'A new comment',
      author: testUser.id,
    });

    const replyComment = await Comment.create({
      post: post.id,
      body: 'A new reply',
      author: testUser.id,
      parentComment: parentComment.id,
    });

    const entityId = replyComment.id;

    post.comments = [parentComment.id, replyComment.id];
    parentComment.replies = [replyComment.id];

    await post.save();
    await parentComment.save();

    await api
      .post('/api/likes')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        entityId,
        entityModel: 'Comment',
      })
      .expect(201);

    const replyLikeCountBefore = await Like.countDocuments({ 'likedEntity.id': entityId });

    expect(replyLikeCountBefore).toBe(1);

    await api
      .delete(`/api/posts/${post.id}/comments/${parentComment.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(204);

    const replyLikeCountAfter = await Like.countDocuments({ 'likedEntity.id': entityId });

    expect(replyLikeCountAfter).toBe(0);
  });
});

describe('notifications', () => {
  let testUser2: User;
  let accessToken2: string;

  beforeEach(async () => {
    (SocketManager.getInstance().emitNotification as jest.Mock).mockClear();

    testUser2 = await testHelpers.createTestUser({
      username: 'bobbybo2',
      fullName: 'Bobby Bo2',
      email: 'bobby2@email.com',
      password: 'secret',
    });

    const response = await api
      .post('/api/auth/login')
      .send({
        username: testUser2.username,
        password: 'secret',
      })
      .expect(200);

    accessToken2 = response.body.accessToken;
  });

  test('liking another user\'s entity should create a notification for the entity creator', async () => {
    const post = await Post.findOne({ creator: testUser.id });
    const entityId = post.id;

    // liking the post with testUser2
    await api
      .post('/api/likes')
      .set('Authorization', `Bearer ${accessToken2}`)
      .send({
        entityId,
        entityModel: 'Post',
      })
      .expect(201);

    const notification = await Notification.findOne({
      creator: testUser2.id,
      recipient: testUser.id,
      'entity.id': entityId,
    });

    expect(notification).not.toBeNull();
    expect(notification?.type).toBe('like');
  });

  test('liking another user\'s entity should emit a notification to the user if they are connected', async () => {
    const post = await Post.findOne({ creator: testUser.id });
    const entityId = post.id;
    const emitNotificationSpy = jest.spyOn(SocketManager.getInstance(), 'emitNotification');

    await api
      .post('/api/likes')
      .set('Authorization', `Bearer ${accessToken2}`)
      .send({
        entityId,
        entityModel: 'Post',
      })
      .expect(201);

    expect(emitNotificationSpy).toHaveBeenCalledTimes(1);
    expect(emitNotificationSpy).toHaveBeenCalledWith(testUser.id, 'like');
  });

  test('user liking their own entity should not create a notification', async () => {
    const post = await Post.findOne({ creator: testUser.id });
    const entityId = post.id;

    await api
      .post('/api/likes')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        entityId,
        entityModel: 'Post',
      })
      .expect(201);

    const notification = await Notification.findOne({
      creator: testUser.id,
      recipient: testUser.id,
      'entity.id': entityId,
    });

    expect(notification).toBeNull();
  });

  test('user liking their own entity should not emit a notification', async () => {
    const post = await Post.findOne({ creator: testUser.id });
    const entityId = post.id;
    const emitNotificationSpy = jest.spyOn(SocketManager.getInstance(), 'emitNotification');

    await api
      .post('/api/likes')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        entityId,
        entityModel: 'Post',
      })
      .expect(201);

    expect(emitNotificationSpy).not.toHaveBeenCalled();
  });

  test('unliking an post should delete any notification associated to it', async () => {
    const post = await Post.findOne({ creator: testUser.id });
    const entityId = post.id;

    await api
      .post('/api/likes')
      .set('Authorization', `Bearer ${accessToken2}`)
      .send({
        entityId,
        entityModel: 'Post',
      })
      .expect(201);

    const notification = await Notification.findOne({
      creator: testUser2.id,
      recipient: testUser.id,
      'entity.id': entityId,
    });

    expect(notification).not.toBeNull();

    await api
      .delete(`/api/likes/${entityId}`)
      .set('Authorization', `Bearer ${accessToken2}`)
      .expect(204);

    const notificationAfter = await Notification.findOne({
      creator: testUser2.id,
      recipient: testUser.id,
      'entity.id': entityId,
    });

    expect(notificationAfter).toBeNull();
  });

  test('unliking a comment should delete any notification associated to it', async () => {
    const post = await Post.findOne({ creator: testUser.id });
    const newComment = await Comment.create({
      post: post.id,
      body: 'A new comment',
      author: testUser2.id,
    });
    const entityId = newComment.id;

    post.comments = [newComment.id];
    await post.save();

    // liking the comment with testUser
    await api
      .post('/api/likes')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        entityId,
        entityModel: 'Comment',
      })
      .expect(201);

    const notification = await Notification.findOne({
      creator: testUser.id,
      recipient: testUser2.id,
    });

    expect(notification).not.toBeNull();

    await api
      .delete(`/api/likes/${entityId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(204);

    const notificationAfter = await Notification.findOne({
      creator: testUser.id,
      recipient: testUser2.id,
    });

    expect(notificationAfter).toBeNull();
  });
});
