import {
  screen,
  renderWithRouter,
  mockLogin,
  mockLogout,
} from '../utils/test-utils';
import { fakeUser } from '../mocks/handlers';
import server from '../mocks/server';
import App from '../../app/App';

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

test('clicking on back button with no history redirects to home', async () => {
  const { user } = renderWithRouter(<App />, { route: '/accounts/edit' });

  const backBtn = await screen.findByTestId('goBackNavBtn');

  await user.click(backBtn);

  expect(screen.getByTestId('homepage-container')).toBeVisible();
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
