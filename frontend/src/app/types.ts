export interface NewUserFields {
  fullName: string,
  username: string,
  email: string,
  password: string,
}

export interface User {
  id: string,
  fullName: string,
  username: string,
  email: string,
  passwordHash: string,
  image?: string,
  posts?: string[],
  followers?: string[],
  following?: string[],
}

export interface LoginFields {
  username: string,
  password: string,
}
