import { rest } from 'msw';
import {
  screen,
  waitFor,
  mockLogout,
  mockLogin,
  renderWithRouter,
  testStore,
} from '../utils/test-utils';
import App from '../../app/App';
import server from '../mocks/server';
import { fakeUser } from '../mocks/handlers';
import '@testing-library/jest-dom/extend-expect';
import { apiSlice } from '../../app/apiSlice';

const fakeTokenInfo = {
  username: fakeUser.username,
  accessToken: 'supersecrettoken',
};

beforeAll(() => server.listen());
afterEach(() => {
  mockLogout({ resetApiState: true });
  server.resetHandlers();
});
afterAll(() => server.close());

test('navigating to profile page of non-existing user displays not found page', async () => {
  renderWithRouter(<App />, { route: '/nonexistingusername' });
  await waitFor(() => {
    expect(screen.getByText(/sorry, this page isn't available./i)).toBeVisible();
    expect(screen.queryByText(/nonexistingusername/i)).toBeNull();
  });
});

test('navigating to profile page of existing user displays their profile', async () => {
  testStore.dispatch(apiSlice.endpoints.getUsers.initiate());
  renderWithRouter(<App />, { route: '/bobbydob' });

  await waitFor(() => {
    expect(screen.getAllByText(/bobbydob/i)).toHaveLength(2);
  });
});

test('if not logged in and profile has avatar image, clicking on avatar does not display modal', async () => {
  mockLogin({ fakeTokenInfo });

  // uploading test image

  server.use(
    rest.get('/api/users', (req, res, ctx) => res(ctx.status(200), ctx.json([{
      ...fakeUser,
      image: {
        url: 'https://i.picsum.photos/id/237/200/300.jpg?hmac=TmmQSbShHz9CdQm0NkEjx1Dyh_Y984R9LpNrpvH2D_U',
        publicId: 'fakePublicId',
      },
    }]))),
    rest.post('/api/auth/refresh', (req, res, ctx) => {
      console.log('POST /api/auth/refresh - failure');
      ctx.delay(2500);

      return res(ctx.status(401), ctx.json({ error: 'refresh token missing or invalid.' }));
    }),
  );

  testStore.dispatch(apiSlice.endpoints.getUsers.initiate());

  const { user } = renderWithRouter(<App />, { route: `/${fakeUser.username}` });

  const profileAvatar = await screen.findByTestId('profile-info-avatar');
  await user.click(profileAvatar);

  await waitFor(async () => {
    expect(screen.queryByTestId('change-avatar-modal')).not.toBeInTheDocument();
  });
});
