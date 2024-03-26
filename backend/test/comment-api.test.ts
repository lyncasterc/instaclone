import supertest from 'supertest';
import app from '../src/app';
import {
  testMongodb,
  Post,
  Comment,
  Notification,
} from '../src/mongo';
import { User } from '../src/types';
import testHelpers from './helpers/test-helpers';
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

describe('when creating comments', () => {
  test('request without accessToken should fail', async () => {
    const post = await Post.findOne({ creator: testUser.id });

    const response = await api
      .post(`/api/posts/${post.id}/comments`)
      .send({ body: 'This is a comment.' })
      .expect(401);

    expect(response.body.error).toMatch(/token missing or invalid/i);
  });

  test('request without comment body should fail', async () => {
    const post = await Post.findOne({ creator: testUser.id });
    const invalidComment = {
      post: post.id,
      author: testUser.id,
    };

    const alsoInvalidComment = {
      post: post.id,
      body: '',
    };

    const responseOne = await api
      .post(`/api/posts/${post.id}/comments`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(invalidComment)
      .expect(400);

    const responseTwo = await api
      .post(`/api/posts/${post.id}/comments`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(alsoInvalidComment)
      .expect(400);

    expect(responseOne.body.error).toMatch(/incorrect or missing body/i);
    expect(responseTwo.body.error).toMatch(/incorrect or missing body/i);
  });

  test('request with non-existent post id should fail', async () => {
    const post = await Post.findOne({ creator: testUser.id });
    const postId = post.id;

    await post.deleteOne();

    const comment = {
      body: 'This is a comment.',
    };

    const response = await api
      .post(`/api/posts/${postId}/comments`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(comment)
      .expect(404);

    expect(response.body.error).toMatch(/post not found/i);
  });

  test('request with valid comment should succeed', async () => {
    const post = await Post.findOne({ creator: testUser.id });

    const validComment = {
      body: 'This is a comment.',
    };

    await api
      .post(`/api/posts/${post.id}/comments`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(validComment)
      .expect(201);

    const updatedPost = await Post.findById(post.id).populate('comments');

    expect(updatedPost.comments.length).toBe(1);
    expect(updatedPost.comments[0].body).toBe('This is a comment.');
  });

  test('requests that reply to a non-existent parent comment should fail', async () => {
    const post = await Post.findOne({ creator: testUser.id });
    const parentComment = await Comment.create({
      post: post.id,
      body: 'This is a comment.',
      author: testUser.id,
    });
    const parentCommentId = parentComment.id;

    await parentComment.deleteOne();

    const reply = {
      body: 'This is a reply.',
      parentComment: parentCommentId,
    };

    const response = await api
      .post(`/api/posts/${post.id}/comments`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(reply)
      .expect(404);

    expect(response.body.error).toMatch(/comment not found/i);
  });

  test('request that replies to a valid parent comment should succeed', async () => {
    const post = await Post.findOne({ creator: testUser.id });
    const parentComment = await Comment.create({
      post: post.id,
      body: 'This is a comment.',
      author: testUser.id,
    });

    post.comments = [parentComment.id];

    await post.save();

    const reply = {
      body: 'This is a reply.',
      parentComment: parentComment.id,
    };

    await api
      .post(`/api/posts/${post.id}/comments`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(reply)
      .expect(201);

    const updatedPost = await Post.findById(post.id).populate('comments');
    const updatedParentComment = await Comment.findById(parentComment.id).populate('replies');

    expect(updatedPost.comments.length).toBe(2);
    expect(updatedParentComment.replies.length).toBe(1);
    expect(updatedParentComment.replies[0].body).toBe('This is a reply.');
  });
});

describe('when getting parent comments', () => {
  test('getting parent comments for a deleted post should fail', async () => {
    const post = await Post.findOne({ creator: testUser.id });
    const postId = post.id;
    const comment = await Comment.create({
      post: postId,
      body: 'This is a comment.',
      author: testUser.id,
    });
    const commentId = comment.id;

    post.comments = [comment.id];

    await post.save();

    await api
      .delete(`/api/posts/${postId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(204);

    const response = await api
      .get(`/api/posts/${postId}/comments`)
      .expect(404);

    expect(response.body.error).toMatch(/post not found/i);

    const updatedComment = await Comment.findById(commentId);

    expect(updatedComment).toBeNull();
  });

  test('getting parent comments for a post with no comments should return an empty array', async () => {
    const post = await Post.findOne({ creator: testUser.id });

    const response = await api
      .get(`/api/posts/${post.id}/comments`)
      .expect(200);

    expect(response.body).toEqual([]);
  });

  test('getting parent comments for a post with comments should return an array of comments', async () => {
    const post = await Post.findOne({ creator: testUser.id });
    const comment = await Comment.create({
      post: post.id,
      body: 'This is a comment.',
      author: testUser.id,
    });

    post.comments = [comment.id];

    await post.save();

    const response = await api
      .get(`/api/posts/${post.id}/comments`)
      .expect(200);

    expect(response.body.length).toBe(1);
    expect(response.body[0].body).toBe('This is a comment.');
  });
});

describe('when getting replies', () => {
  test('getting replies for a deleted post should fail', async () => {
    const post = await Post.findOne({ creator: testUser.id });
    const postId = post.id;
    const parentComment = await Comment.create({
      post: post.id,
      body: 'This is a comment.',
      author: testUser.id,
    });
    const parentCommentId = parentComment.id;

    post.comments = [parentComment.id];

    await post.save();

    await api
      .delete(`/api/posts/${postId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(204);

    const response = await api
      .get(`/api/posts/${postId}/comments/${parentCommentId}`)
      .expect(404);

    expect(response.body.error).toMatch(/post not found/i);
  });

  test('getting replies for a deleted parent comment should fail', async () => {
    const post = await Post.findOne({ creator: testUser.id });
    const postId = post.id;
    const parentComment = await Comment.create({
      post: post.id,
      body: 'This is a comment.',
      author: testUser.id,
    });
    const replyComment = await Comment.create({
      post: post.id,
      body: 'This is a reply.',
      author: testUser.id,
      parentComment: parentComment.id,
    });
    const parentCommentId = parentComment.id;

    parentComment.replies = [replyComment.id];

    await parentComment.save();
    await parentComment.remove();

    const response = await api
      .get(`/api/posts/${postId}/comments/${parentCommentId}`)
      .expect(404);

    expect(response.body.error).toMatch(/comment not found/i);
  });

  test('getting replies for a parent comment with no replies should return an empty array', async () => {
    const post = await Post.findOne({ creator: testUser.id });
    const parentComment = await Comment.create({
      post: post.id,
      body: 'This is a comment.',
      author: testUser.id,
    });

    post.comments = [parentComment.id];

    await post.save();

    const response = await api
      .get(`/api/posts/${post.id}/comments/${parentComment.id}`)
      .expect(200);

    expect(response.body).toEqual([]);
  });

  test('getting replies for a parent comment with replies should return an array of comments', async () => {
    const post = await Post.findOne({ creator: testUser.id });
    const parentComment = await Comment.create({
      post: post.id,
      body: 'This is a comment.',
      author: testUser.id,
    });
    const replyComment = await Comment.create({
      post: post.id,
      body: 'This is a reply.',
      author: testUser.id,
      parentComment: parentComment.id,
    });

    post.comments = [parentComment.id];
    parentComment.replies = [replyComment.id];

    await post.save();
    await parentComment.save();

    const response = await api
      .get(`/api/posts/${post.id}/comments/${parentComment.id}`)
      .expect(200);

    expect(response.body.length).toBe(1);
    expect(response.body[0].body).toBe('This is a reply.');
  });
});

describe('when deleting comments', () => {
  test('deleting a comment on an already deleted post should fail', async () => {
    const post = await Post.findOne({ creator: testUser.id });
    const postId = post.id;
    const comment = await Comment.create({
      post: postId,
      body: 'This is a comment.',
      author: testUser.id,
    });

    post.comments = [comment.id];

    await post.save();

    await api
      .delete(`/api/posts/${postId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(204);

    const response = await api
      .delete(`/api/posts/${postId}/comments/${comment.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(404);

    expect(response.body.error).toMatch(/post not found/i);
  });

  test('deleting non-existent comment should fail', async () => {
    const post = await Post.findOne({ creator: testUser.id });
    const comment = await Comment.create({
      post: post.id,
      body: 'This is a comment.',
      author: testUser.id,
    });

    post.comments = [comment.id];

    await post.save();

    await comment.remove();

    const response = await api
      .delete(`/api/posts/${post.id}/comments/${comment.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(404);

    expect(response.body.error).toMatch(/comment not found/i);
  });

  test('deleting a reply to a deleted parent comment should fail', async () => {
    const post = await Post.findOne({ creator: testUser.id });
    const parentComment = await Comment.create({
      post: post.id,
      body: 'This is a comment.',
      author: testUser.id,
    });
    const replyComment = await Comment.create({
      post: post.id,
      body: 'This is a reply.',
      author: testUser.id,
      parentComment: parentComment.id,
    });

    post.comments = [parentComment.id];
    parentComment.replies = [replyComment.id];

    await post.save();
    await parentComment.save();

    await parentComment.remove();

    const response = await api
      .delete(`/api/posts/${post.id}/comments/${replyComment.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(404);

    expect(response.body.error).toMatch(/comment not found/i);
  });

  test('deleting a comment should succeed', async () => {
    const post = await Post.findOne({ creator: testUser.id });
    const comment = await Comment.create({
      post: post.id,
      body: 'This is a comment.',
      author: testUser.id,
    });

    post.comments = [comment.id];

    await post.save();

    await api
      .delete(`/api/posts/${post.id}/comments/${comment.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(204);

    const updatedPost = await Post.findById(post.id);

    expect(updatedPost.comments.length).toBe(0);
  });

  test('deleting a reply should succeed', async () => {
    const post = await Post.findOne({ creator: testUser.id });
    const parentComment = await Comment.create({
      post: post.id,
      body: 'This is a comment.',
      author: testUser.id,
    });
    const replyComment = await Comment.create({
      post: post.id,
      body: 'This is a reply.',
      author: testUser.id,
      parentComment: parentComment.id,
    });

    parentComment.replies = [replyComment.id];
    post.comments = [parentComment.id, replyComment.id];

    await post.save();
    await parentComment.save();

    await api
      .delete(`/api/posts/${post.id}/comments/${replyComment.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(204);

    const updatedParentComment = await Comment.findById(parentComment.id);
    const updatedPost = await Post.findById(post.id);

    expect(updatedParentComment.replies.length).toBe(0);
    expect(updatedPost.comments.length).toBe(1);
  });

  test('deleting a parent comment should delete all its replies', async () => {
    const post = await Post.findOne({ creator: testUser.id });
    const parentComment = await Comment.create({
      post: post.id,
      body: 'This is a comment.',
      author: testUser.id,
    });
    const replyComment = await Comment.create({
      post: post.id,
      body: 'This is a reply.',
      author: testUser.id,
      parentComment: parentComment.id,
    });

    const parentCommentId = parentComment.id;
    const replyCommentId = replyComment.id;

    parentComment.replies = [replyComment.id];
    post.comments = [parentComment.id, replyComment.id];

    await post.save();
    await parentComment.save();

    await api
      .delete(`/api/posts/${post.id}/comments/${parentComment.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(204);

    const updatedPost = await Post.findById(post.id);

    expect(updatedPost.comments.length).toBe(0);

    const updatedParentComment = await Comment.findById(parentCommentId);
    const updatedReplyComment = await Comment.findById(replyCommentId);

    expect(updatedParentComment).toBeNull();
    expect(updatedReplyComment).toBeNull();
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

  test('user commenting on another user\'s post should create a notification for post creator', async () => {
    const post = await Post.findOne({ creator: testUser.id });

    await api
      .post(`/api/posts/${post.id}/comments`)
      .set('Authorization', `Bearer ${accessToken2}`)
      .send({ body: 'This is a comment.' })
      .expect(201);

    const notification = await Notification.findOne({
      creator: testUser2.id,
      recipient: testUser.id,
    });

    expect(notification).not.toBeNull();
    expect(notification?.type).toBe('comment');
  });

  test('user replying to another user\'s comment should create a notification for the post creator', async () => {
    const post = await Post.findOne({ creator: testUser.id });
    const parentComment = await Comment.create({
      post: post.id,
      body: 'This is a comment.',
      author: testUser2.id,
    });

    post.comments = [parentComment.id];

    await post.save();

    // reply to the parent comment
    await api
      .post(`/api/posts/${post.id}/comments`)
      .set('Authorization', `Bearer ${accessToken2}`)
      .send({
        body: 'This is a reply.',
        parentComment: parentComment.id,
      })
      .expect(201);

    const notification = await Notification.findOne({
      creator: testUser2.id,
      recipient: testUser.id,
    });

    expect(notification).not.toBeNull();
    expect(notification?.type).toBe('comment');
  });

  test('user commenting on another user\'s post should emit a notification to the post creator', async () => {
    const post = await Post.findOne({ creator: testUser.id });
    const emitNotificationSpy = jest.spyOn(SocketManager.getInstance(), 'emitNotification');

    await api
      .post(`/api/posts/${post.id}/comments`)
      .set('Authorization', `Bearer ${accessToken2}`)
      .send({ body: 'This is a comment.' })
      .expect(201);

    expect(emitNotificationSpy).toHaveBeenCalledTimes(1);
    expect(emitNotificationSpy).toHaveBeenCalledWith(testUser.id, 'comment');
  });

  test('user commenting on their own post should not create a notification', async () => {
    const post = await Post.findOne({ creator: testUser.id });

    await api
      .post(`/api/posts/${post.id}/comments`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ body: 'This is a comment.' })
      .expect(201);

    const notification = await Notification.findOne({
      creator: testUser.id,
      recipient: testUser.id,
    });

    expect(notification).toBeNull();
  });

  test('user commenting on their own post should not emit a notification', async () => {
    const post = await Post.findOne({ creator: testUser.id });
    const emitNotificationSpy = jest.spyOn(SocketManager.getInstance(), 'emitNotification');

    await api
      .post(`/api/posts/${post.id}/comments`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ body: 'This is a comment.' })
      .expect(201);

    expect(emitNotificationSpy).not.toHaveBeenCalled();
  });

  test('deleting a comment should delete any notifications associated with it', async () => {
    const post = await Post.findOne({ creator: testUser.id });

    // commenting on the post to create a notification
    await api
      .post(`/api/posts/${post.id}/comments`)
      .set('Authorization', `Bearer ${accessToken2}`)
      .send({ body: 'This is a comment.' })
      .expect(201);

    const notification = await Notification.findOne({
      creator: testUser2.id,
      recipient: testUser.id,
    });

    expect(notification).not.toBeNull();

    // deleting the comment
    const comment = await Comment.findOne({ author: testUser2.id });

    await api
      .delete(`/api/posts/${post.id}/comments/${comment.id}`)
      .set('Authorization', `Bearer ${accessToken2}`)
      .expect(204);

    const updatedNotification = await Notification.findOne({
      creator: testUser2.id,
      recipient: testUser.id,
    });

    expect(updatedNotification).toBeNull();
  });
});
