export interface NewUserFields {
  fullName: string,
  username: string,
  email: string,
  password: string,
}

export interface UpdatedUserFields {
  fullName?: string,
  username?: string,
  email?: string,
  password?: string,
  bio?: string,
  imageDataUrl?: string,
}

export interface Image {
  url: string,
  publicId: string
}

export interface User {
  id: string,
  fullName: string,
  username: string,
  email: string,
  bio?: string,
  passwordHash: string,
  image?: Image,
  posts?: string[],
  followers?: string[],
  following?: string[],
}

export interface LoginFields {
  username: string,
  password: string,
}
