import { NewUser } from '../types';

const isString = (text: unknown): text is string => typeof text === 'string' || text instanceof String;

const parseStringField = (param: unknown, fieldKey: string) => {
  if (!param || !isString(param)) {
    throw new Error(`incorrect or missing ${fieldKey}`);
  }

  return param;
};

interface NewUserUnknownFields {
  fullName: unknown,
  email: unknown,
  username: unknown,
  password: unknown,
}

const toNewUser = ({
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

export default {
  toNewUser,
};
