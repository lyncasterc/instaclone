import { rest } from 'msw';
import {
  NewUserFields,
  LoginFields,
  UpdatedUserFields,
} from '../../app/types';

export const fakeUser = {
  id: '1',
  fullName: 'Bob Dob',
  username: 'bobbydob',
  email: 'bob@dob.com',
  bio: '',
  passwordHash: 'secrethashstash',
  image: null,
  posts: [],
  followers: [],
  following: [],
};

export const handlers = [
  rest.post<NewUserFields>('/api/users', (req, res, ctx) => {
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
  rest.post<LoginFields>('/api/login', (req, res, ctx) => res(ctx.status(200), ctx.json({
    username: req.body.username,
    token: 'supersecrettoken',
  }))),
  rest.put<UpdatedUserFields>('/api/users/:id', (req, res, ctx) => res(ctx.status(200), ctx.json({
    ...fakeUser,
    fullName: req.body.fullName ?? fakeUser.fullName,
    username: req.body.username ?? fakeUser.username,
    email: req.body.email ?? fakeUser.email,
    bio: req.body.bio ?? fakeUser.bio,
    image: req.body.imageDataUrl
      ? { url: req.body.imageDataUrl, publicId: 'fakepublicid' }
      : fakeUser.image,
  }))),
  rest.get('/api/users', (req, res, ctx) => res(ctx.status(200), ctx.json([fakeUser]))),
];
