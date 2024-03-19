import { rest } from 'msw';
import PostComponent from '../../features/posts/PostComponent/PostComponent';
import {
  renderWithRouter,
  screen,
  waitFor,
  mockLogout,
} from '../utils/test-utils';
import server from '../mocks/server';
import '@testing-library/jest-dom/extend-expect';
import { fakeUser } from '../mocks/handlers';
import testImageDataUrl from '../../../cypress/fixtures/test-image-data-url';

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  mockLogout({ resetApiState: true });
});
afterAll(() => server.close());

/*
  Just some background on this test (because I'll surely forget):

  The apiSlice intercepts HTTP requests and checks if a request
  returns 401 (unauthorized), which usually would mean that the access token is expired.

  If it does, the apiSlice makes a call to
  the refresh endpoint to get a new access token and then retries the original request.

  This test is just to make that sure that works as expected.

  From the user's perspective, the user should not see any difference in the UI.

  This test will use the PostComponent as the vehicle to test this through the like button.

  The user should be able to like a post like normal.

  So as far as assertions go, we just need to make sure that the like count updates like normal.
*/

test('user with "expired" access token can still like a post', async () => {
  // setting up the server to return a 401 on the first like attempt
  server.use(
    rest.post('/api/likes', (req, res, ctx) => {
      console.log('POST /api/likes - failure');
      return res.once(ctx.status(401), ctx.json({ error: 'token expired.' }));
    }),
    rest.post('/api/likes', (req, res, ctx) => {
      console.log('POST /api/likes - success');
      return res(ctx.status(201));
    }),
  );

  const post = {
    id: '1',
    creator: { ...fakeUser },
    caption: 'This is a post',
    image: { url: testImageDataUrl, publicId: 'fakepublicid' },
    comments: [],
    likes: [],
    createdAt: '2021-08-01T00:00:00.000Z',
    updatedAt: '2021-08-01T00:00:00.000Z',
  };
  const setAlertText = jest.fn();

  const { user } = renderWithRouter(<PostComponent post={post} setAlertText={setAlertText} />);

  expect(screen.queryByText(/1 like/i)).not.toBeInTheDocument();

  const likeButton = screen.getByTestId('like-post-btn');

  await user.click(likeButton);

  // if the like count was updated
  // then we know the second like was made and was successful
  await waitFor(async () => {
    expect(screen.getByText(/1 like/i)).toBeVisible();
  });
});
