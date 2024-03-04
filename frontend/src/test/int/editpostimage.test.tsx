// import { rest } from 'msw';
import {
  screen,
  renderWithRouter,
  mockLogin,
  mockLogout,
  waitFor,
  fireEvent,
  dataURItoBlob,
} from '../utils/test-utils';
import { fakeUser } from '../mocks/handlers';
import { store } from '../../app/store';
import server from '../mocks/server';
import { apiSlice } from '../../app/apiSlice';
import App from '../../app/App';
import testImage from '../utils/test-image';

beforeAll(() => server.listen());
beforeEach(() => {
  const fakeTokenInfo = {
    username: fakeUser.username,
    token: 'supersecrettoken',
  };
  mockLogin({ fakeTokenInfo });
  store.dispatch(apiSlice.endpoints.getUsers.initiate());
});
afterEach(() => {
  mockLogout({ resetApiState: true });
  server.resetHandlers();
});
afterAll(() => server.close());

test('navigating to /create/edit without having uploaded image redirects to home', async () => {
  renderWithRouter(<App />, { route: '/create/edit' });

  await waitFor(() => {
    expect(screen.getByTestId('home-nav')).toBeVisible();
  });
});

test('uploading an image redirects to /create/edit', async () => {
  const blob = dataURItoBlob(testImage);
  const file = new File([blob], 'clouds-test-img.jpeg', { type: 'image/jpeg' });
  renderWithRouter(<App />);

  // "uploading" the image from the home page

  const input = await screen.findByTestId('postImageUpload');

  fireEvent.change(input, {
    target: {
      files: [file],
    },
  });

  const newPostPhoto = await screen.findByText(/new post photo/i);

  expect(newPostPhoto).toBeVisible();
});
