import { mockLogin, testStore } from './test-utils';
import { removeAuthenticatedState } from '../../features/auth/authSlice';

afterEach(() => {
  testStore.dispatch(removeAuthenticatedState());
});

const fakeTokenInfo = {
  username: 'bobbydob',
  accessToken: 'supersecrettoken',
};

test('mockLogin stores the access token data in the Redux store', () => {
  mockLogin({ fakeTokenInfo });
  const state = testStore.getState();

  expect(state.auth.username).toBe(fakeTokenInfo.username);
  expect(state.auth.accessToken).toBe(fakeTokenInfo.accessToken);
});
