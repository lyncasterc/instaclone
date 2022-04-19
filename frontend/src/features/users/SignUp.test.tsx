import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import {
  screen,
  renderWithHistory,
  // waitFor,
  // prettyDOM,
} from '../../common/utils/test-utils';
import SignUp from './SignUp';

test('login page can be reached from signup', async () => {
  const { history } = renderWithHistory(<SignUp />);
  const user = userEvent.setup();
  await user.click(screen.getByText(/log in/i));

  expect(history.location.pathname).toBe('/login');
});

test('button is disabled if all fields are not filled in', async () => {
  renderWithHistory(<SignUp />);
  const user = userEvent.setup();
  const signupFields = {
    email: 'fake@email.com',
    username: 'fakeusername',
  };

  await user.type(screen.getByPlaceholderText(/email/i), signupFields.email);
  await user.type(screen.getByPlaceholderText(/username/i), signupFields.username);

  expect(screen.getByRole('button')).toBeDisabled();
});

test('button is not disabled if all fields are filled in', async () => {
  renderWithHistory(<SignUp />);
  const user = userEvent.setup();
  const signupFields = {
    email: 'fake@email.com',
    username: 'fakeusername',
    fullName: 'fake name',
    password: 'fake password',
  };

  await user.type(screen.getByPlaceholderText(/email/i), signupFields.email);
  await user.type(screen.getByPlaceholderText(/username/i), signupFields.username);
  await user.type(screen.getByPlaceholderText(/password/i), signupFields.password);
  await user.type(screen.getByPlaceholderText(/full name/i), signupFields.fullName);

  expect(screen.getByRole('button')).toBeEnabled();
});

test('red x is rendered when user clears a field', async () => {
  renderWithHistory(<SignUp />);
  const user = userEvent.setup();

  const usernameInput = screen.getByPlaceholderText(/username/i);

  await user.type(usernameInput, 'fakeusername');
  await user.clear(usernameInput);
  await user.click(screen.getByText(/instaclone/i));

  const redX = screen.getByTestId('redx');
  expect(redX).toBeInTheDocument();
  expect(screen.getByTestId('redx')).toBeVisible();
});
