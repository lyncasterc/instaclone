import { MemoryRouter } from 'react-router-dom';
import {
  screen,
  render,
} from '../../common/utils/test-utils';
import App from '../../app/App';
import { store } from '../../app/store';
import { initAuthedUser } from '../../features/auth/authSlice';
import '@testing-library/jest-dom/extend-expect';

test('redirects user to login form when not logged in', () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  );

  expect(screen.getByText(/log in/i)).toBeVisible();
});

test('logged in user is taken to home page', async () => {
  // mocking logged in state
  const fakeTokenInfo = {
    username: 'bobbydob',
    token: 'supersecrettoken',
  };
  localStorage.setItem('instacloneSCToken', JSON.stringify(fakeTokenInfo));

  // mirroring the logic in index.tsx
  store.dispatch(initAuthedUser());
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  );

  // TODO: update this when home page is nearing completion
  expect(screen.getByText(fakeTokenInfo.username)).toBeVisible();
});
