import {
  screen,
  renderWithRouter,
  mockLogin,
  mockLogout,
  waitFor,
} from '../utils/test-utils';
import App from '../../app/App';
import '@testing-library/jest-dom/extend-expect';
import { fakeUser } from '../mocks/handlers';
import server from '../mocks/server';
import { apiSlice } from '../../app/apiSlice';
import { store } from '../../app/store';

beforeAll(() => server.listen());
afterEach(() => {
  mockLogout({ resetApiState: true });
  server.resetHandlers();
});
afterAll(() => server.close());

test('redirects user to login form when not logged in', () => {
  renderWithRouter(
    <App />,
  );

  expect(screen.getByText(/Don't have an account/i)).toBeVisible();
});

test('logged in user is taken to home page', async () => {
  const fakeTokenInfo = {
    username: 'bobbydob',
    token: 'supersecrettoken',
  };
  mockLogin({ fakeTokenInfo });

  renderWithRouter(
    <App />,
  );

  expect(screen.getByTestId('homepage-container')).toBeVisible();
});

test('when user logs in, it redirects user to route they were attempting to visit', async () => {
  store.dispatch(apiSlice.endpoints.getUsers.initiate());

  const { user } = renderWithRouter(<App />, { route: '/accounts/edit' });
  await user.type(screen.getByPlaceholderText(/username/i), fakeUser.username);
  await user.type(screen.getByPlaceholderText(/password/i), 'secret');
  await user.click(screen.getByRole('button'));

  await waitFor(() => {
    expect(screen.getByText(/bio/i)).toBeVisible();
  });
});
