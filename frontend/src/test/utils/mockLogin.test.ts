import { mockLogin } from './test-utils';
import { store } from '../../app/store';
import { removeAuthenticatedState } from '../../features/auth/authSlice';

afterEach(() => {
  localStorage.removeItem('instacloneSCToken');
  store.dispatch(removeAuthenticatedState());
});

const fakeTokenInfo = {
  username: 'bobbydob',
  accessToken: 'supersecrettoken',
};

test('mockLogin saves a token in localStorage', () => {
  mockLogin({ fakeTokenInfo });
  const storedToken = localStorage.getItem('instacloneSCToken');

  expect(storedToken).not.toBeNull();
  expect(JSON.parse(storedToken!)).toEqual(fakeTokenInfo);
});

test('mockLogin stores the token info in the Redux store', () => {
  mockLogin({ fakeTokenInfo });
  const state = store.getState();

  expect(state.auth.username).toBe(fakeTokenInfo.username);
  expect(state.auth.accessToken).toBe(fakeTokenInfo.accessToken);
});
