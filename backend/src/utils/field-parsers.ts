import validDataUrl from 'valid-data-url';
import { NewUser, ProofedUpdatedUserFields } from '../types';

const isString = (text: unknown): text is string => typeof text === 'string' || text instanceof String;

export const parseStringField = (param: unknown, fieldKey: string) => {
  if (!param || !isString(param)) {
    throw new Error(`incorrect or missing ${fieldKey}`);
  }

  return param;
};

const parseDataURIField = (param: unknown) => {
  if (!param || !isString(param) || !validDataUrl(param)) {
    throw new Error('Malformed or missing image');
  }

  return param;
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
  bio?: unknown,
  imageDataUrl?: unknown,
}

const proofUpdateUserFields = ({
  fullName, username, email, password, imageDataUrl, bio,
}: UnknownUpdateUserFields): ProofedUpdatedUserFields => {
  const user: ProofedUpdatedUserFields = {};

  if (fullName) user.fullName = parseStringField(fullName, 'full name');
  if (username) user.username = parseStringField(username, 'username');
  if (email) user.email = parseStringField(email, 'email');
  if (password) user.password = parseStringField(password, 'password');
  if (bio) user.bio = parseStringField(bio, 'bio');
  if (imageDataUrl) user.imageDataUrl = parseDataURIField(imageDataUrl);

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

interface UnknownPostFields {
  caption: unknown,
  imageDataUrl: unknown,
}

const proofPostFields = ({ caption, imageDataUrl }: UnknownPostFields) => {
  const optionalCaption = caption ? parseStringField(caption, 'caption') : '';

  const postFields = {
    caption: optionalCaption,
    imageDataUrl: parseDataURIField(imageDataUrl),
  };

  return postFields;
};

// TODO: change to named exports.
export default {
  proofNewUserFields,
  proofUpdateUserFields,
  proofLogInFields,
  proofPostFields,
};
