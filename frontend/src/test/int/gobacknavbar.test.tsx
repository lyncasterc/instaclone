import {
  screen, renderWithRouter, mockLogin, mockLogout,
} from '../utils/test-utils';
import { fakeUser } from '../mocks/handlers';
import { store } from '../../app/store';
import server from '../mocks/server';
import { apiSlice } from '../../app/apiSlice';
import App from '../../app/App';

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

test('clicking on back button with no history redirects to home', async () => {
  const { user } = renderWithRouter(<App />, { route: '/accounts/edit' });

  const backBtn = await screen.findByTestId('goBackNavBtn');

  await user.click(backBtn);

  // TODO: change this to a better test when the home page is implemented
  const username = await screen.findByText(fakeUser.username);

  expect(username).toBeVisible();
});

test('clicking on back button with history goes back', async () => {
  const { user } = renderWithRouter(<App />);

  // navigate to user profile
  await user.click(await screen.findByTestId('bottom-nav-avatar'));

  // navigate to edit profile
  await user.click(await screen.findByText(/edit profile/i));

  // navigate back
  const backBtn = await screen.findByTestId('goBackNavBtn');
  await user.click(backBtn);

  const profileAvatar = await screen.findByTestId('profile-info-avatar');

  expect(profileAvatar).toBeVisible();
  expect(backBtn).not.toBeVisible();
});
