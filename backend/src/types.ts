// TODO: do the reference fields need to be of type string or their actual types?

export interface Image {
  url: string,
  publicId: string,
}

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
  creator: User, // ref -> User
  caption?: string,
  image: Image,
  comments?: string[], // ref
  likes?: string[], // ref -> User
  createdAt: string, // Date
  updatedAt: string, // Date
}

export interface User {
  id: string,
  fullName: string,
  username: string,
  email: string,
  bio?: string,
  passwordHash: string,
  image?: Image,
  posts?: string[], // ref
  followers?: string[], // ref -> User
  following?: string[], //  ref -> User
}

export interface NewUser {
  fullName: string,
  username: string,
  email: string,
  password: string,
}

export interface NewPostFields {
  caption?: string,
  imageDataUrl: string,
}

export interface NewPost {
  caption?: string,
  image: Image,
}

export interface ProofedUpdatedUserFields {
  fullName?: string,
  username?: string,
  email?: string,
  password?: string,
  bio?: string,
  imageDataUrl?: string,
  followers?: string[] // ref -> User
  following?: string[] // ref -> User
}

export interface UpdatedUserFields extends Omit<ProofedUpdatedUserFields, 'imageDataUrl'> {
  image?: Image,
}

export interface ProofedUpdatedPost {
  caption?: string,
  comments?: string[] // ref,
  likes?: string[] // ref -> User
}
