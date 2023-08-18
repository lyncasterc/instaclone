import { rest } from 'msw';
import {
  screen,
  waitFor,
  mockLogin,
  mockLogout,
  renderWithRouter,
} from '../utils/test-utils';
import App from '../../app/App';
import server from '../mocks/server';
import { fakeUser } from '../mocks/handlers';
import '@testing-library/jest-dom/extend-expect';

beforeAll(() => server.listen());
afterEach(() => {
  mockLogout({ resetApiState: true });
  server.resetHandlers();
});
afterAll(() => server.close());

const signupFields = {
  email: fakeUser.email,
  username: fakeUser.username,
  fullName: fakeUser.fullName,
  password: 'secret',
};

jest.setTimeout(10000);

test('user can signup successfully', async () => {
  const { user } = renderWithRouter(<App />);

  await user.click(screen.getByText('Sign up'));
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

  const { user } = renderWithRouter(<App />);

  await user.click(screen.getByText('Sign up'));
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

test('user is redirected to home page if they visit the signup page and are already logged in', async () => {
  const fakeTokenInfo = {
    username: 'bobbydob',
    token: 'supersecrettoken',
  };
  mockLogin({ fakeTokenInfo });

  renderWithRouter(<App />, { route: '/signup' });

  expect(screen.queryByText(/don't have an account?/i)).toBeNull();
  expect(screen.getByText(fakeTokenInfo.username)).toBeVisible();
});
