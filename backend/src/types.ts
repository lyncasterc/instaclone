// TODO: do the reference fields need to be of type string or their actual types?

export interface Comment {
  id: string,
  post: string, // ref
  comment: string,
  author: string, // ref -> User
  parentComment?: string, // ref
  replies?: string[] // ref -> Comment
}

export interface Post {
  id: string,
  creator: string, // ref -> User
  caption?: string,
  image: string,
  comments?: string[], // ref
  likes?: string[], // ref -> User
}

export interface User {
  id: string,
  fullName: string,
  username: string,
  email: string,
  passwordHash: string,
  image?: string,
  posts?: string[], // ref
  followers?: string[], // ref -> User
  following?: string[], //  ref -> User
}

export interface NewUser {
  fullName: string,
  username: string,
  email: string,
  password: string,
  image?: string,
}

export interface NewPost {
  caption: string,
  image: string,
}

// TODO: add followers, following to this
export interface ProofedUpdatedUser {
  fullName?: string,
  username?: string,
  email?: string,
  password?: string,
  image?: string,
}

export interface ProofedUpdatedPost {
  caption?: string,
  comments?: string[] // ref,
  likes?: string[] // ref -> User
}
