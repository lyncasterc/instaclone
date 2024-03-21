import { rest } from 'msw';
import {
  screen,
  renderWithRouter,
  mockLogout,
  waitFor,
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

test('RequireAuth.tsx protects route, Login.tsx redirects user back to protected router after they login', async () => {
  server.use(
    rest.post('/api/auth/refresh', (req, res, ctx) => {
      console.log('POST /api/auth/refresh - failure');
      ctx.delay(2500);

      return res(ctx.status(401), ctx.json({ error: 'refresh token missing or invalid.' }));
    }),
  );

  const { user } = renderWithRouter(<App />, { route: '/accounts/edit' });

  const usernameInput = await screen.findByPlaceholderText(/username/i);
  const passwordInput = await screen.findByPlaceholderText(/password/i);
  const loginButton = await screen.findByRole('button');

  await user.type(usernameInput, fakeUser.username);
  await user.type(passwordInput, 'secret');
  await user.click(loginButton);

  await waitFor(() => {
    expect(screen.getByText(/bio/i)).toBeVisible();
  });
});
