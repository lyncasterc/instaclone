import { rest } from 'msw';
import {
  screen,
  waitFor,
  mockLogout,
  mockLogin,
  renderWithRouter,
} from '../utils/test-utils';
import App from '../../app/App';
import server from '../mocks/server';
import { fakeUser } from '../mocks/handlers';
import '@testing-library/jest-dom/extend-expect';
import { store } from '../../app/store';
import { apiSlice } from '../../app/apiSlice';

const fakeTokenInfo = {
  username: fakeUser.username,
  token: 'supersecrettoken',
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
  store.dispatch(apiSlice.endpoints.getUsers.initiate());

  renderWithRouter(<App />, { route: '/bobbydob' });
  await waitFor(() => {
    expect(screen.getByText(/bobbydob/i)).toBeVisible();
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
  );

  store.dispatch(apiSlice.endpoints.getUsers.initiate());

  const { user } = renderWithRouter(<App />, { route: `/${fakeUser.username}` });

  mockLogout({ resetApiState: false });

  const profileAvatar = await screen.findByTestId('profile-info-avatar');
  await user.click(profileAvatar);

  await waitFor(async () => {
    expect(screen.queryByTestId('change-avatar-modal')).not.toBeInTheDocument();
  });
});

test('if logged in and profile has avatar image, clicking on avatar displays modal', async () => {
  mockLogin({ fakeTokenInfo });

  server.use(
    rest.get('/api/users', (req, res, ctx) => res(ctx.status(200), ctx.json([{
      ...fakeUser,
      image: {
        url: 'https://i.picsum.photos/id/237/200/300.jpg?hmac=TmmQSbShHz9CdQm0NkEjx1Dyh_Y984R9LpNrpvH2D_U',
        publicId: 'fakePublicId',
      },
    }]))),
  );

  store.dispatch(apiSlice.endpoints.getUsers.initiate());
  const { user } = renderWithRouter(<App />, { route: '/accounts/edit' });

  const avatar = await screen.findByTestId('avatar');
  await user.click(avatar);

  await waitFor(async () => {
    expect(screen.queryByTestId('change-avatar-modal')).toBeVisible();
  });
});

// testing ChangeAvatarModal features inside UseProfile
test('when clicking on avatar, modal does not appear if user does not have an image', async () => {
  mockLogin({ fakeTokenInfo });

  store.dispatch(apiSlice.endpoints.getUsers.initiate());
  const { user } = renderWithRouter(<App />, { route: '/accounts/edit' });

  await waitFor(async () => {
    await user.click(screen.getByTestId('avatar'));
    expect(screen.queryByText(/remove current photo/i)).toBeNull();
  });
});
