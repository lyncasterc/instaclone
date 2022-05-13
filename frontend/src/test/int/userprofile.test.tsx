import {
  screen,
  waitFor,
  mockLogout,
  renderWithRouter,
} from '../utils/test-utils';
import App from '../../app/App';
import server from '../mocks/server';
import '@testing-library/jest-dom/extend-expect';
import { store } from '../../app/store';
import { apiSlice } from '../../app/apiSlice';

beforeAll(() => server.listen());
afterEach(() => {
  mockLogout();
  server.resetHandlers();
});
afterAll(() => server.close());

test('navigating to profile page of non-existing user displays not found page', async () => {
  renderWithRouter(<App />, { route: '/nonexistingusername' });
  await waitFor(() => {
    expect(screen.getByText(/sorry, this page isn't available./i)).toBeVisible();
    expect(screen.queryByText(/nonexistingusername/i)).toBeNull();
  });
});

test('navigating to profile page of existing user displays their profile', async () => {
  store.dispatch(apiSlice.endpoints.getUsers.initiate());

  renderWithRouter(<App />, { route: '/bobbydob' });
  await waitFor(() => {
    expect(screen.getByText(/bobbydob/i)).toBeVisible();
  });
});
