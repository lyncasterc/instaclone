import { rest } from 'msw';
import {
  screen,
  renderWithRouter,
  mockLogin,
  mockLogout,
  waitFor,
  within,
  testStore,
} from '../../../test/utils/test-utils';
import '@testing-library/jest-dom/extend-expect';
import { fakeUser } from '../../../test/mocks/handlers';
import server from '../../../test/mocks/server';
import { apiSlice } from '../../../app/apiSlice';
import UserMenu from './UserMenu';

beforeAll(() => server.listen());
beforeEach(() => {
  const fakeTokenInfo = {
    username: fakeUser.username,
    accessToken: 'supersecrettoken',
  };
  mockLogin({ fakeTokenInfo });
});
afterEach(() => {
  mockLogout({ resetApiState: true });
  server.resetHandlers();
});
afterAll(() => server.close());

test('when user has a profile image, it is displayed in user menu', async () => {
  const imageSrc = 'https://i.picsum.photos/id/237/200/300.jpg?hmac=TmmQSbShHz9CdQm0NkEjx1Dyh_Y984R9LpNrpvH2D_U';
  server.use(
    rest.get('/api/users', (req, res, ctx) => res(ctx.status(200), ctx.json([{
      ...fakeUser,
      image: {
        url: imageSrc,
        publicId: 'fakePublicId',
      },
    }]))),
  );

  testStore.dispatch(apiSlice.endpoints.getUsers.initiate());
  renderWithRouter(<UserMenu />);

  await waitFor(() => {
    const avatar = screen.getByTestId('usermenu');
    const profileImage = within(avatar).getByRole('img');

    expect(profileImage).toHaveAttribute('src', imageSrc);
  });
});
