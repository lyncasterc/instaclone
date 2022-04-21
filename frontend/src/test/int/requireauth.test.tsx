import {
  screen,
  renderWithRouter,
  mockLogin,
} from '../utils/test-utils';
import App from '../../app/App';
import '@testing-library/jest-dom/extend-expect';

test('redirects user to login form when not logged in', () => {
  renderWithRouter(
    <App />,
  );

  expect(screen.getByText(/log in/i)).toBeVisible();
});

test('logged in user is taken to home page', async () => {
  const fakeTokenInfo = {
    username: 'bobbydob',
    token: 'supersecrettoken',
  };
  mockLogin({ fakeTokenInfo });

  renderWithRouter(
    <App />,
  );

  // TODO: update this when home page is nearing completion
  expect(screen.getByText(fakeTokenInfo.username)).toBeVisible();
});
