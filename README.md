# instaclone - in progress

Instaclone is an Instagram clone written using the MERN stack + TypeScript.

This is a final project after having completed [Full Stack Open 2022](https://fullstackopen.com/).

<strong>To check out the work completed so far, switch to the `dev` branch!</strong>

### How to navigate this project
#### Frontend
- The frontend uses [RTK Query](https://redux-toolkit.js.org/rtk-query/overview). The [api slice](https://github.com/lyncasterc/instaclone/blob/dev/frontend/src/app/apiSlice.ts)
handles data-fetching and caching. Here's an [example of data-fetching logic using RTK Query](https://github.com/lyncasterc/instaclone/blob/dev/frontend/src/common/hooks/useAuth.ts) in my `useAuth.ts` hook.
- [Mantine](https://mantine.dev/) is used for the styles. Check out the [`BottomNavBar`](https://github.com/lyncasterc/instaclone/tree/dev/frontend/src/common/components/BottomNavBar) for an example!
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) with [MSW](https://mswjs.io/) for unit and integration tests. Here's an [example](https://github.com/lyncasterc/instaclone/blob/dev/frontend/src/test/int/login.test.tsx)!
- [Cypress](https://docs.cypress.io/) for e2e tests. Here's an [example](https://github.com/lyncasterc/instaclone/blob/dev/frontend/cypress/integration/navbar.spec.ts)!

#### Backend
- Uses a in-memory MongoDB server for testing and some development. [Check it out!](https://github.com/lyncasterc/instaclone/blob/dev/backend/src/mongo/test-mongodb.ts) However, I'm using a Docker Mongo container for the majority of the development of this app. Here's the [docker-compose file.](https://github.com/lyncasterc/instaclone/blob/dev/backend/docker-compose.dev.yml)
- I seperate the Mongo querying logic from the Express routing logic. Each model has it's own _service_ ([User service example](https://github.com/lyncasterc/instaclone/blob/dev/backend/src/services/user-service.ts)) and router ([User router example](https://github.com/lyncasterc/instaclone/blob/dev/backend/src/routes/users.ts)).
- Uses JWT for authentication. Here's the [login route](https://github.com/lyncasterc/instaclone/blob/dev/backend/src/routes/login.ts) and the [`authenticator` custom middleware](https://github.com/lyncasterc/instaclone/blob/dev/backend/src/utils/middleware.ts) used for protecting certain routes.
- Uses [Cloudinary](https://cloudinary.com/documentation) for image uploading. Here's the [`cloudinary.ts` file](https://github.com/lyncasterc/instaclone/blob/dev/backend/src/utils/cloudinary.ts) I've written so far (work in progress, but image uploading is working).
- Integration tests using [Jest](https://jestjs.io/) and [supertest](https://github.com/visionmedia/supertest). [Example](https://github.com/lyncasterc/instaclone/blob/dev/backend/test/login-api.test.ts).

### Things to do:
- Core functionality of Instagram: 
  - ~Create account, sign up, login~
  - ~User profile view~, ~editing user profile~, ~uploading avatar image~, ~following/unfollowing users~
  - ~Creating posts~, liking posts, ~deleting posts~
  - ~Commenting on posts, commenting on comments,~ liking comments
- Searching for users.
- Instant notifications and direct messaging with [Socket.io](https://socket.io/get-started/).
### To run on your machine:
- clone this repo, run `npm i`, then run `git checkout dev` to switch to the dev branch.
- Run `cd frontend` to switch to the `frontend` directory.
- run `npm run server:dev` to run the backend server. This also starts up an in-memory MongoDB server.
- In a different terminal in the `frontend` directory, run `npm start.` 



