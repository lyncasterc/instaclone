import validDataUrl from 'valid-data-url';
import { NewUser, ProofedUpdatedUser } from '../types';

const isString = (text: unknown): text is string => typeof text === 'string' || text instanceof String;

const parseStringField = (param: unknown, fieldKey: string) => {
  if (!param || !isString(param)) {
    throw new Error(`incorrect or missing ${fieldKey}`);
  }

  return param;
};

const parseDataURIField = (param: unknown) => {
  if (param) {
    if (!isString(param) || !validDataUrl(param)) {
      throw new Error('Malformatted image');
    }

    return param;
  }

  return undefined;
};

interface NewUserUnknownFields {
  fullName: unknown,
  email: unknown,
  username: unknown,
  password: unknown,
}

const proofNewUserFields = ({
  fullName, email, username, password,
}: NewUserUnknownFields): NewUser => {
  const newUser: NewUser = {
    fullName: parseStringField(fullName, 'full name'),
    email: parseStringField(email, 'email'),
    username: parseStringField(username, 'username'),
    password: parseStringField(password, 'password'),
  };

  return newUser;
};

// defines the fields that may be present in the body of a PUT request to update a user.
interface UnknownUpdateUserFields {
  fullName?: unknown,
  email?: unknown,
  username?: unknown,
  password?: unknown,
  image?: unknown,
}

const proofUpdateUserFields = ({
  fullName, username, email, password, image,
}: UnknownUpdateUserFields): ProofedUpdatedUser => {
  const user: ProofedUpdatedUser = {};

  if (fullName) user.fullName = parseStringField(fullName, 'full name');
  if (username) user.username = parseStringField(username, 'username');
  if (email) user.email = parseStringField(email, 'email');
  if (password) user.password = parseStringField(password, 'password');
  if (image) user.image = parseDataURIField(image);

  return user;
};

interface UnknownLogInFields {
  username: unknown,
  password: unknown,
}

const proofLogInFields = ({ username, password }: UnknownLogInFields) => {
  const loginFields = {
    username: parseStringField(username, 'username'),
    password: parseStringField(password, 'password'),
  };

  return loginFields;
};

export default {
  proofNewUserFields,
  proofUpdateUserFields,
  proofLogInFields,
};
