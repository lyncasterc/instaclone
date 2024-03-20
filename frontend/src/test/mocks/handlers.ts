import { rest } from 'msw';
import {
  NewUserFields,
  LoginFields,
  UpdatedUserFields,
  NewPostFields,
  User,
  Post,
} from '../../app/types';

export const fakeUser: User = {
  id: '1',
  fullName: 'Bob Dob',
  username: 'bobbydob',
  email: 'bob@dob.com',
  bio: '',
  passwordHash: 'secrethashstash',
  image: undefined,
  posts: [],
  followers: [],
  following: [],
};

export const fakeAccessToken = {
  username: fakeUser.username,
  accessToken: 'supersecrettoken',
};

const posts: Post[] = [];
const users: User[] = [fakeUser];

export const handlers = [
  rest.post<NewUserFields>('/api/users', (req, res, ctx) => {
    console.log('POST /api/users');
    const userFields = req.body;
    return res(ctx.status(201), ctx.json({
      id: fakeUser.id,
      fullName: userFields.fullName,
      username: userFields.username,
      email: userFields.email,
      passwordHash: fakeUser.passwordHash,
      image: fakeUser.image,
      posts: fakeUser.posts,
      followers: fakeUser.followers,
      following: fakeUser.following,
    }));
  }),
  rest.post<NewPostFields>('/api/posts', (req, res, ctx) => {
    console.log('POST /api/posts');
    const postFields = req.body;
    const post: Post = {
      id: '1',
      creator: { ...fakeUser },
      caption: postFields.caption,
      image: { url: postFields.imageDataUrl, publicId: 'fakepublicid' },
      comments: [],
      likes: [],
      createdAt: '2021-08-01T00:00:00.000Z',
      updatedAt: '2021-08-01T00:00:00.000Z',
    };

    if (fakeUser.posts) {
      fakeUser.posts = [post, ...fakeUser.posts];
    } else {
      fakeUser.posts = [post];
    }

    posts.unshift(post);

    ctx.delay(2500);
    return res(ctx.status(201), ctx.json(post));
  }),
  rest.get('/api/posts/:id', (req, res, ctx) => {
    console.log('GET /api/posts/:id');
    const post = posts.find((p) => p.id === req.params.id);

    if (post) {
      return res(ctx.status(200), ctx.json(post));
    }

    return res(ctx.status(404));
  }),
  rest.post<LoginFields>('/api/auth/login', (req, res, ctx) => {
    console.log('POST /api/auth/login');
    return res(ctx.status(200), ctx.json(fakeAccessToken));
  }),
  rest.post('/api/auth/logout', (_req, res, ctx) => {
    console.log('POST /api/auth/logout');
    return res(ctx.status(204));
  }),
  rest.post('/api/auth/refresh', (req, res, ctx) => {
    console.log('POST /api/auth/refresh');
    ctx.delay(2500);

    return res(ctx.status(200), ctx.json(fakeAccessToken));
  }),
  rest.put<UpdatedUserFields>('/api/users/:id', (req, res, ctx) => {
    console.log('PUT /api/users/:id');
    return res(ctx.status(200), ctx.json({
      ...fakeUser,
      fullName: req.body.fullName ?? fakeUser.fullName,
      username: req.body.username ?? fakeUser.username,
      email: req.body.email ?? fakeUser.email,
      bio: req.body.bio ?? fakeUser.bio,
      image: req.body.imageDataUrl
        ? { url: req.body.imageDataUrl, publicId: 'fakepublicid' }
        : fakeUser.image,
    }));
  }),
  rest.get('/api/users', (req, res, ctx) => {
    console.log('GET /api/users');
    return res(ctx.status(200), ctx.json(users));
  }),
  rest.get('/api/likes/:entityId/likeCount', (req, res, ctx) => {
    console.log('GET /api/likes/:entityId/likeCount');
    return res(ctx.status(200), ctx.json({ likeCount: 0 }));
  }),
  rest.get('/api/likes/:entityId/hasLiked', (req, res, ctx) => {
    console.log('GET /api/likes/:entityId/likeCount');
    return res(ctx.status(200), ctx.json({ hasLiked: false }));
  }),
];
