import { rest } from 'msw';
import {
  renderWithRouter,
  screen,
  waitFor,
  mockLogout,
} from '../utils/test-utils';
import App from '../../app/App';
import '@testing-library/jest-dom/extend-expect';
import { fakeUser } from '../mocks/handlers';
import server from '../mocks/server';

beforeAll(() => server.listen());
afterEach(() => {
  mockLogout({ resetApiState: true });
  server.resetHandlers();
});
afterAll(() => server.close());

const loginFields = {
  username: fakeUser.username,
  password: 'secret',
};

test('user can login successfully', async () => {
  const { user } = renderWithRouter(<App />);

  await user.type(screen.getByPlaceholderText(/username/i), loginFields.username);
  await user.type(screen.getByPlaceholderText(/password/i), loginFields.password);
  await user.click(screen.getByRole('button'));

  await waitFor(() => {
    const token = localStorage.getItem('instacloneSCToken');
    expect(token).not.toBeNull();
    const parsedToken = JSON.parse(token!);
    expect(parsedToken.username).toBe(loginFields.username);
  });

  expect(screen.getByTestId('homepage-container')).toBeVisible();
});

test('error is displayed on unsuccessful login', async () => {
  server.use(
    rest.post('/api/auth/login', (req, res, ctx) => res(ctx.status(401), ctx.json({ error: 'Invalid username or password' }))),
  );

  const { user } = renderWithRouter(<App />);

  await user.type(screen.getByPlaceholderText(/username/i), loginFields.username);
  await user.type(screen.getByPlaceholderText(/password/i), loginFields.password);
  await user.click(screen.getByRole('button'));

  await waitFor(() => {
    const token = localStorage.getItem('instacloneSCToken');
    expect(token).toBeNull();
    expect(screen.getByText(/invalid username or password/i)).toBeVisible();
  });
});
