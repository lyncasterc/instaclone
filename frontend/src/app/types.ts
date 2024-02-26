export interface NewUserFields {
  fullName: string,
  username: string,
  email: string,
  password: string,
}

export interface NewPostFields {
  imageDataUrl: string,
  caption?: string,
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

export interface Post {
  id: string,
  creator: string, // ref -> User
  caption?: string,
  image: Image,
  comments?: string[], // ref
  likes?: string[], // ref -> User
}

export interface LoginFields {
  username: string,
  password: string,
}
