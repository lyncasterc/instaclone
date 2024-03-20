import { waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { apiSlice } from '../../app/apiSlice';
import UserProfileEdit from '../../features/users/UserProfile/UserProfileEdit/UserProfileEdit';
import { fakeUser } from '../mocks/handlers';
import server from '../mocks/server';
import {
  mockLogin,
  testStore,
  renderWithRouter,
  screen,
  mockLogout,
} from '../utils/test-utils';

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

  testStore.dispatch(apiSlice.endpoints.getUsers.initiate());
  const { user } = renderWithRouter(<UserProfileEdit user={fakeUser.username} />);

  const avatar = await screen.findByTestId('avatar');
  await user.click(avatar);

  await waitFor(async () => {
    expect(screen.queryByTestId('change-avatar-modal')).toBeVisible();
  });
});

// testing ChangeAvatarModal features inside UseProfile
test('when clicking on avatar, modal does not appear if user does not have an image', async () => {
  mockLogin({ fakeTokenInfo });
  testStore.dispatch(apiSlice.endpoints.getUsers.initiate());

  const { user } = renderWithRouter(<UserProfileEdit user={fakeUser.username} />);

  await waitFor(async () => {
    await user.click(screen.getByTestId('avatar'));
    expect(screen.queryByText(/remove current photo/i)).toBeNull();
  });
});
