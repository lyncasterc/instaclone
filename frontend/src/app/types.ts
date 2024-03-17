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

export interface NewLikeRequestFields {
  entityId: string, // ref -> Post | Comment
  entityModel: 'Post' | 'Comment',
}

export interface GetReplyCommentsRequestFields {
  postId: string,
  parentCommentId: string,
}

export interface DeleteCommentRequestFields {
  postId: string,
  commentId: string,
}

export interface NewCommentFields {
  postId: string,
  body: string,
  parentComment?: string,
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
  posts?: Post[],
  followers?: { id: string, username: string }[],
  following?: { id: string, username: string }[],
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

export interface Comment {
  id: string,
  post: string, // ref -> Post
  body: string,
  author: {
    id: string,
    username: string,
  }, // ref -> User
  parentComment?: string, // ref -> Comment (the root comment)
  replies?: string[], // ref -> Comment (only parent comments can have replies)
  createdAt: string, // Date
  updatedAt: string, // Date
}

export interface LoginFields {
  username: string,
  password: string,
}
