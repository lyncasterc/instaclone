/* eslint-disable max-len */
// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
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

import { NewUserFields, LoginFields } from '../../src/app/types';

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom Cypress command to create a test user.
       * @param newUserFields - contains four required string fields: fullName, username, password, email
       */
      createUser(newUserFields: NewUserFields): Chainable<Element>,
      /**
       * Custom Cypress command to log in a test user.
       *
       * Saves token to localStorage and redirects to homepage ('/') after logging in.
       * @param loginFields - contains two required string fields: username, password
       */
      login(loginFields: LoginFields): Chainable<Element>
    }
  }
}
