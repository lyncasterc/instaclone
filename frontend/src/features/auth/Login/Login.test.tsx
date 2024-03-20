import { rest } from 'msw';
import {
  renderWithRouter,
  screen,
  waitFor,
  mockLogout,
} from '../../../test/utils/test-utils';
import '@testing-library/jest-dom/extend-expect';
import { fakeUser } from '../../../test/mocks/handlers';
import server from '../../../test/mocks/server';
import Login from './Login';

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

test('submit button is disabled until all fields are filled', async () => {
  const { user } = renderWithRouter(<Login />);

  const loginButton = screen.getByRole('button');
  const usernameInput = screen.getByPlaceholderText(/username/i);
  const passwordInput = screen.getByPlaceholderText(/password/i);

  expect(loginButton).toBeDisabled();

  await user.type(usernameInput, loginFields.username);
  expect(loginButton).toBeDisabled();

  await user.type(passwordInput, loginFields.password);

  expect(loginButton).not.toBeDisabled();
});

test('user can see checkmarks when input is valid', async () => {
  const { user } = renderWithRouter(<Login />);

  const usernameInput = screen.getByPlaceholderText(/username/i);
  const passwordInput = screen.getByPlaceholderText(/password/i);

  await waitFor(() => {
    expect(screen.queryByTestId('input-circle-check')).toBeNull();
  });

  await user.type(usernameInput, loginFields.username);
  await user.type(passwordInput, loginFields.password);
  await user.click(usernameInput);

  await waitFor(() => {
    expect(screen.getAllByTestId('input-circle-check')).toHaveLength(2);
  });
});

test('user can see red x\'s when focusing away from empty inputs', async () => {
  const { user } = renderWithRouter(<Login />);

  const usernameInput = screen.getByPlaceholderText(/username/i);
  const passwordInput = screen.getByPlaceholderText(/password/i);

  await user.click(usernameInput);
  await user.click(passwordInput);
  await waitFor(() => {
    expect(screen.getByTestId('redx')).toBeVisible();
  });

  await user.click(passwordInput);
  await user.click(usernameInput);
  await waitFor(() => {
    expect(screen.getAllByTestId('redx')).toHaveLength(2);
  });
});

test('user can see error message after unsuccessful login', async () => {
  server.use(
    rest.post('/api/auth/login', (req, res, ctx) => res(ctx.status(401), ctx.json({ error: 'Invalid username or password' }))),
  );
  const { user } = renderWithRouter(<Login />);

  const usernameInput = await screen.findByPlaceholderText(/username/i);
  const passwordInput = await screen.findByPlaceholderText(/password/i);
  const loginButton = screen.getByRole('button');

  await user.type(usernameInput, loginFields.username);
  await user.type(passwordInput, loginFields.password);
  await user.click(loginButton);

  await waitFor(() => {
    expect(screen.getByText(/invalid username or password/i)).toBeVisible();
  });
});
