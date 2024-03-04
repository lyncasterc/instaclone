/* eslint-disable max-len */
// ***********************************************************
// This example support/index.js is processed and
// loaded automatically beforeEach your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

import { NewUserFields, LoginFields, UpdatedUserFields } from '../../src/app/types';

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom Cypress command to create a test user.
       * @param newUserFields - Object containing required new user fields.
       * @param {string} newUserFields.email - Test user's email address.
       * @param {string} newUserFields.fullName - Test user's full name.
       * @param {string} newUserFields.username - Test user's username.
       * @param {string} newUserFields.password - Test user's password.
       */
      createUser(newUserFields: NewUserFields): Chainable<Element>,
      /**
       * Custom Cypress command to log in a test user.
       *
       * Saves token to localStorage and redirects to homepage ('/') after logging in.
       * @param loginFields - Object containing username and password fields.
       */
      login(loginFields: LoginFields): Chainable<Element>,
      /**
       * Custom Cypress command to create a post.
       * Uses the logged in user's token to authenticate the request.
       */
      createPost(): Chainable<Element>,
      /**
       * Custom Cypress command to edit a user.
       * Uses the logged in user's token to authenticate the request.
       * @param updatedUserFields - Object containing fields to update.
       */
      editUser(updatedUserFields: UpdatedUserFields): Chainable<Element>,
    }
  }
}
