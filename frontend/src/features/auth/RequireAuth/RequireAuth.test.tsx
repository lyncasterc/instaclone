import RequireAuth from './RequireAuth';
import {
  renderWithRouter,
  mockLogout,
  mockLogin,
  screen,
} from '../../../test/utils/test-utils';
import server from '../../../test/mocks/server';

beforeAll(() => server.listen());
afterEach(() => {
  mockLogout({ resetApiState: true });
  server.resetHandlers();
});
afterAll(() => server.close());

test('logged in user can see children components', () => {
  const fakeTokenInfo = {
    username: 'bobbydob',
    accessToken: 'supersecrettoken',
  };
  mockLogin({ fakeTokenInfo });

  const child = <div>I am a child</div>;

  renderWithRouter(<RequireAuth>{child}</RequireAuth>);

  const childText = screen.getByText(/I am a child/i);

  expect(childText).toBeVisible();
});
