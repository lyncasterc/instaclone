import { rest } from 'msw';
import { createBrowserHistory } from 'history';
import { unstable_HistoryRouter as HistoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import {
  screen,
  mockLogin,
  mockLogout,
  render,
  Providers,
  waitFor,
  waitForElementToBeRemoved,
} from '../utils/test-utils';
import { store } from '../../app/store';
import { fakeUser } from '../mocks/handlers';
import server from '../mocks/server';
import { apiSlice } from '../../app/apiSlice';
import App from '../../app/App';
import testImage from '../utils/test-image';

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

test('creating a post navigates to homepage and displays an alert', async () => {
  await store.dispatch(apiSlice.endpoints.getUsers.initiate());
  const history = createBrowserHistory();
  history.push('/create/details', { croppedImage: testImage });

  render(
    <HistoryRouter history={history}>
      <Providers>
        <App />
      </Providers>
    </HistoryRouter>,
  );

  const shareBtns = await screen.findAllByText(/share/i);
  const shareBtn = shareBtns[0];

  const user = userEvent.setup();

  await user.click(shareBtn);

  await waitFor(() => {
    expect(history.location.pathname).toBe('/');
    expect(screen.getByText(/post added/i)).toBeVisible();
  });
});

test('share button not visible while post is being created', async () => {
  await store.dispatch(apiSlice.endpoints.getUsers.initiate());
  const history = createBrowserHistory();
  history.push('/create/details', { croppedImage: testImage });

  render(
    <HistoryRouter history={history}>
      <Providers>
        <App />
      </Providers>
    </HistoryRouter>,
  );

  const shareBtns = await screen.findAllByText(/share/i);
  const shareBtn = shareBtns[0];
  const user = userEvent.setup();

  await user.click(shareBtn);

  expect(shareBtn).not.toBeVisible();

  const sharingTexts = screen.queryAllByText(/sharing/i);
  expect(sharingTexts.length).toBeGreaterThan(0);

  // Wait for the sharing text to disappear to fix the act warning
  // Wait for all "sharing" texts to disappear
  await waitForElementToBeRemoved(() => screen.queryAllByText(/sharing/i));
});

test('unsuccessful post creation navigates to homepage and displays an alert', async () => {
  server.use(
    rest.post('/api/posts', (req, res, ctx) => res(ctx.status(500))),
  );

  await store.dispatch(apiSlice.endpoints.getUsers.initiate());
  const history = createBrowserHistory();
  history.push('/create/details', { croppedImage: testImage });

  render(
    <HistoryRouter history={history}>
      <Providers>
        <App />
      </Providers>
    </HistoryRouter>,
  );

  const shareBtns = await screen.findAllByText(/share/i);
  const shareBtn = shareBtns[0];

  const user = userEvent.setup();

  await user.click(shareBtn);

  await waitFor(() => {
    expect(history.location.pathname).toBe('/');
    expect(screen.getByText(/error creating post/i)).toBeVisible();
  });
});
