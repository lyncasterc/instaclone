import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { MemoryRouter } from 'react-router-dom';
import {
  render,
  screen,
  waitFor,
} from '../../common/utils/test-utils';
import App from '../../app/App';
import { apiSlice } from '../../app/apiSlice';
import { removeCurrentUser } from '../../features/auth/authSlice';
import { store } from '../../app/store';
import '@testing-library/jest-dom/extend-expect';
import { NewUserFields, LoginFields } from '../../app/types';

const fakeUser = {
  id: '1',
  fullName: 'Bob Dob',
  username: 'bobbydob',
  email: 'bob@dob.com',
  passwordHash: 'secrethashstash',
  image: undefined,
  posts: [],
  followers: [],
  following: [],
};

const server = setupServer(
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
);

beforeAll(() => server.listen());
afterEach(() => {
  store.dispatch(apiSlice.util.resetApiState());
  store.dispatch(removeCurrentUser());
  localStorage.removeItem('instacloneSCToken');
  server.resetHandlers();
});
afterAll(() => server.close());

test('user can signup successfully', async () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  );
  const user = userEvent.setup();
  const signupFields = {
    email: fakeUser.email,
    username: fakeUser.username,
    fullName: fakeUser.fullName,
    password: 'secret',
  };

  await user.click(screen.getByText(/sign up/i));
  await user.type(screen.getByPlaceholderText(/email/i), signupFields.email);
  await user.type(screen.getByPlaceholderText(/username/i), signupFields.username);
  await user.type(screen.getByPlaceholderText(/password/i), signupFields.password);
  await user.type(screen.getByPlaceholderText(/full name/i), signupFields.fullName);

  await user.click(screen.getByRole('button'));

  // Testing that user is logged in after successful signup

  await waitFor(() => {
    const token = localStorage.getItem('instacloneSCToken');
    expect(token).not.toBeNull();
    const parsedToken = JSON.parse(token!);
    expect(parsedToken.username).toBe(signupFields.username);
  });

  // testing that user has been redirected to home page
  // TODO: update this when Home component design is nearing finalization.
  expect(screen.getByText(fakeUser.username)).toBeVisible();
});

test('error is displayed on unsuccessful signup', async () => {
  server.use(
    rest.post('/api/users', (req, res, ctx) => res(ctx.status(400), ctx.json({ error: 'That username is already taken!' }))),
  );

  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  );

  const user = userEvent.setup();
  const signupFields = {
    email: fakeUser.email,
    username: fakeUser.username,
    fullName: fakeUser.fullName,
    password: 'secret',
  };

  await user.click(screen.getByText(/sign up/i));
  await user.type(screen.getByPlaceholderText(/email/i), signupFields.email);
  await user.type(screen.getByPlaceholderText(/username/i), signupFields.username);
  await user.type(screen.getByPlaceholderText(/password/i), signupFields.password);
  await user.type(screen.getByPlaceholderText(/full name/i), signupFields.fullName);

  await user.click(screen.getByRole('button'));

  await waitFor(() => {
    const token = localStorage.getItem('instacloneSCToken');
    expect(token).toBeNull();
    expect(screen.getByText(/That username is already taken/i)).toBeVisible();
  });
});
