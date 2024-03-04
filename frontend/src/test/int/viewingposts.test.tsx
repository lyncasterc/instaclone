import { createBrowserHistory } from 'history';
import { unstable_HistoryRouter as HistoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import {
  screen,
  mockLogin,
  mockLogout,
  render,
  Providers,
  waitFor,
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
    token: 'supersecrettoken',
  };
  mockLogin({ fakeTokenInfo });
});
afterEach(() => {
  mockLogout({ resetApiState: true });
  server.resetHandlers();
});
afterAll(() => server.close());

/*
  The purpose of these tests are to ensure that after a user
  creates a post, the posts can be viewed wherever posts are viewable.

  Currently, those places should be the user profile page, the homepage, and the post's view page.
*/

test('post is viewable in homepage after creating it', async () => {
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
    const img = screen.getByRole('img');
    expect(img).toBeVisible();
    expect(img).toHaveAttribute('src', testImage);
  });
});

test.only('post is viewable in the user profile after creating it', async () => {
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
  });

  // Navigate to user profile
  act(() => {
    history.push(`/${fakeUser.username}`);
  });

  // simulating a page refresh
  await store.dispatch(apiSlice.endpoints.getUsers.initiate(undefined, { forceRefetch: true }));

  await waitFor(() => {
    expect(history.location.pathname).toBe(`/${fakeUser.username}`);
    expect(screen.getByText(/edit profile/i)).toBeVisible();
    const images = screen.getAllByRole('img');
    const postedImage = images.find((img) => img.getAttribute('src') === testImage);

    expect(postedImage).toBeDefined();
    expect(postedImage).toBeVisible();
  });
});

test.only('post is viewable in the post view page', async () => {
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
  });

  // Navigate to user profile
  act(() => {
    history.push(`/${fakeUser.username}`);
  });

  // simulating a page refresh
  await store.dispatch(apiSlice.endpoints.getUsers.initiate(undefined, { forceRefetch: true }));

  await waitFor(async () => {
    expect(history.location.pathname).toBe(`/${fakeUser.username}`);
    expect(screen.getByText(/edit profile/i)).toBeVisible();
    const images = screen.getAllByRole('img');
    const postedImage = images.find((img) => img.getAttribute('src') === testImage);
    expect(postedImage).toBeDefined();

    // going to the post view page
    await user.click(postedImage!);
  });

  await waitFor(() => {
    expect(history.location.pathname).toBe(`/p/${fakeUser.posts![0].id}`);
    const images = screen.getAllByRole('img');
    const postedImage = images.find((img) => img.getAttribute('src') === testImage);

    expect(postedImage).toBeDefined();
    expect(postedImage).toBeVisible();
  });
});
