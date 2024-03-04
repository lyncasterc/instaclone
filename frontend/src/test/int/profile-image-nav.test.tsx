import { rest } from 'msw';
import {
  screen,
  renderWithRouter,
  mockLogin,
  mockLogout,
  waitFor,
  within,
} from '../utils/test-utils';
import App from '../../app/App';
import '@testing-library/jest-dom/extend-expect';
import { fakeUser } from '../mocks/handlers';
import server from '../mocks/server';
import { apiSlice } from '../../app/apiSlice';
import { store } from '../../app/store';

beforeAll(() => server.listen());
beforeEach(() => {
  const fakeTokenInfo = {
    username: fakeUser.username,
    token: 'supersecrettoken',
  };
  mockLogin({ fakeTokenInfo });
});
afterEach(() => {
  mockLogout({ resetApiState: true });
  server.resetHandlers();
});
afterAll(() => server.close());

test('when user has a profile image, it is displayed in mobile nav', async () => {
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

  store.dispatch(apiSlice.endpoints.getUsers.initiate());
  renderWithRouter(<App />, { route: '/' });

  await waitFor(() => {
    const avatar = screen.getByTestId('bottom-nav-avatar');
    const profileImage = within(avatar).getByRole('img');

    expect(profileImage).toHaveAttribute('src', imageSrc);
  });
});

test('when user has no profile image, a default image is displayed in mobile nav', async () => {
  store.dispatch(apiSlice.endpoints.getUsers.initiate());
  renderWithRouter(<App />, { route: '/' });

  const avatar = await screen.findByTestId('bottom-nav-avatar');

  await waitFor(() => {
    const image = within(avatar).queryByRole('img');
    const placeholderSvg = avatar.querySelector('svg');

    expect(placeholderSvg).not.toBeNull();
    expect(image).toBeNull();
  });
});

test('when user has no profile image, a default image is displayed in desktop nav', async () => {
  store.dispatch(apiSlice.endpoints.getUsers.initiate());
  renderWithRouter(<App />, { route: '/' });

  const avatar = await screen.findByTestId('desktop-nav-avatar');

  await waitFor(() => {
    const image = within(avatar).queryByRole('img');
    const placeholderSvg = avatar.querySelector('svg');

    expect(placeholderSvg).not.toBeNull();
    expect(image).toBeNull();
  });
});

test('when user has a profile image, it is displayed in desktop nav', async () => {
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

  store.dispatch(apiSlice.endpoints.getUsers.initiate());
  renderWithRouter(<App />, { route: '/' });

  await waitFor(() => {
    const avatar = screen.getByTestId('bottom-nav-avatar');
    const profileImage = within(avatar).getByRole('img');

    expect(profileImage).toHaveAttribute('src', imageSrc);
  });
});
