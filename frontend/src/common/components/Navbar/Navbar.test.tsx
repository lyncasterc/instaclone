import { renderWithRouter, screen, mockLogin } from '../../../test/utils/test-utils';
import '@testing-library/jest-dom/extend-expect';
import Navbar from './Navbar';

test('Login and Signup buttons are displayed when not logged in', () => {
  renderWithRouter(<Navbar />);
  expect(screen.getByText(/log in/i)).toBeVisible();
  expect(screen.getByText(/sign up/i)).toBeVisible();
});

test('Login and Signup buttons are displayed when not logged in', () => {
  mockLogin({
    fakeTokenInfo: {
      username: 'bobbydob',
      token: 'supersecrettoken',
    },
  });
  renderWithRouter(<Navbar />);
  expect(screen.queryByText(/log in/i)).toBeNull();
  expect(screen.queryByText(/sign up/i)).toBeNull();
  expect(screen.getByTestId('usermenu')).toBeVisible();
});
