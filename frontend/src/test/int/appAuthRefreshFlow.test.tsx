import { rest } from 'msw';
import { renderWithRouter, screen, mockLogout } from '../utils/test-utils';
import server from '../mocks/server';
import App from '../../app/App';

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  mockLogout({ resetApiState: true });
});
afterAll(() => server.close());

it('if App refresh request is successful, user is redirected to homepage', async () => {
  renderWithRouter(<App />);

  const homepage = await screen.findByTestId('homepage-container');
  expect(homepage).toBeVisible();
});

it('displays a loading spinner while App refresh request is pending and disappears after', async () => {
  renderWithRouter(<App />);

  const loader = await screen.findByTestId('app-loader');

  expect(loader).toBeVisible();

  await screen.findByTestId('homepage-container');

  expect(loader).not.toBeInTheDocument();
});

it('if App refresh request fails, user is redirected to login page', async () => {
  server.use(
    rest.post('/api/auth/refresh', (_req, res, ctx) => res(ctx.status(401), ctx.json({
      error: 'refresh token missing or invalid.',
    }))),
  );

  renderWithRouter(<App />);

  const loginText = await screen.findByText(/don't have an account?/i);
  const loginButton = await screen.findByRole('button', { name: /log in/i });

  expect(loginText).toBeVisible();
  expect(loginButton).toBeVisible();
});
