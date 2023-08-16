import { rest } from 'msw';
import {
  screen,
  renderWithRouter,
  mockLogin,
  mockLogout,
  waitFor,
  fireEvent,
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

test('user with an image can upload a new one', async () => {
  const oldImage = 'https://i.picsum.photos/id/237/200/300.jpg?hmac=TmmQSbShHz9CdQm0NkEjx1Dyh_Y984R9LpNrpvH2D_U';

  server.use(
    rest.get('/api/users', (req, res, ctx) => res.once(ctx.status(200), ctx.json([{
      ...fakeUser,
      image: {
        url: oldImage,
        publicId: 'fakePublicId',
      },
    }]))),
  );

  const file = new File(['hello'], 'anyfile.png', { type: 'image/png' });

  store.dispatch(apiSlice.endpoints.getUsers.initiate());
  const { user } = renderWithRouter(<App />, { route: '/accounts/edit' });

  const avatarImage = await screen.findByRole('img');
  expect(avatarImage).toHaveAttribute('src', oldImage);

  await user.click(screen.getByText(/change profile photo/i));

  const input = await screen.findByLabelText(/upload photo/i) as HTMLInputElement;
  fireEvent.change(input, {
    target: {
      files: [file],
    },
  });

  await waitFor(async () => {
    expect(avatarImage).not.toHaveAttribute('src', oldImage);

    // Asserts that UserProfileAlert appears on screen, indicating successful image upload.
    expect(screen.getByText(/profile photo added/i)).toBeVisible();
  });
});

test('updating username updates the JWT username field', async () => {
  store.dispatch(apiSlice.endpoints.getUsers.initiate());
  const { user } = renderWithRouter(<App />, { route: '/accounts/edit' });

  const usernameInput = await screen.findByPlaceholderText(/username/i);
  const submitButton = await screen.findByText(/submit/i);

  await user.clear(usernameInput);
  await user.type(usernameInput, 'billy');
  await user.click(submitButton);

  await waitFor(() => {
    const token = localStorage.getItem('instacloneSCToken');
    if (token) {
      const parsedToken = JSON.parse(token);
      expect(parsedToken.username).toBe('billy');
    }
  });
});

// testing ChangeAvatarModal features inside UserProfileEdit
test('when clicking on avatar, modal does not appear if user does not have an image', async () => {
  store.dispatch(apiSlice.endpoints.getUsers.initiate());
  const { user } = renderWithRouter(<App />, { route: '/accounts/edit' });

  await waitFor(async () => {
    await user.click(screen.getByTestId('avatar'));
    expect(screen.queryByText(/remove current photo/i)).toBeNull();
  });
});

test('when clicking on avatar, modal does appear if user has an image', async () => {
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
    expect(screen.getByText(/remove current photo/i)).toBeVisible();
  });
});
