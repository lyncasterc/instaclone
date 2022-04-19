import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { rest } from 'msw';
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
import { fakeUser } from '../mocks/handlers';
import server from '../mocks/server';

beforeAll(() => server.listen());
afterEach(() => {
  store.dispatch(apiSlice.util.resetApiState());
  store.dispatch(removeCurrentUser());
  localStorage.removeItem('instacloneSCToken');
  server.resetHandlers();
});
afterAll(() => server.close());

test('user can login successfully', async () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  );
  const user = userEvent.setup();
  const loginFields = {
    username: fakeUser.username,
    password: 'secret',
  };

  await user.type(screen.getByPlaceholderText(/username/i), loginFields.username);
  await user.type(screen.getByPlaceholderText(/password/i), loginFields.password);
  await user.click(screen.getByRole('button'));

  await waitFor(() => {
    const token = localStorage.getItem('instacloneSCToken');
    expect(token).not.toBeNull();
    const parsedToken = JSON.parse(token!);
    expect(parsedToken.username).toBe(loginFields.username);
  });

  expect(screen.getByText(fakeUser.username)).toBeVisible();
});

test('error is displayed on unsuccessful login', async () => {
  server.use(
    rest.post('/api/login', (req, res, ctx) => res(ctx.status(401), ctx.json({ error: 'Invalid username or password' }))),
  );

  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  );

  const user = userEvent.setup();
  const loginFields = {
    username: fakeUser.username,
    password: 'secret',
  };

  await user.type(screen.getByPlaceholderText(/username/i), loginFields.username);
  await user.type(screen.getByPlaceholderText(/password/i), loginFields.password);
  await user.click(screen.getByRole('button'));

  await waitFor(() => {
    const token = localStorage.getItem('instacloneSCToken');
    expect(token).toBeNull();
    expect(screen.getByText(/invalid username or password/i)).toBeVisible();
  });
});
