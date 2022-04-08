import { Post } from '../mongo';
import { NewPost } from '../types';
// TODO: figure out what exactly needs to be populated.
const getPost = async (id: string) => {
  const post = await Post.findById(id)
    .populate('creator', { username: 1, image: 1 })
    .populate('comments');

  return post;
};

const addPost = async (postFields: NewPost, creator: string) => {
  const post = {
    ...postFields,
    creator,
  };
  const savedPost = await Post.create(post);

  return savedPost;
};

export default {
  getPost,
  addPost,
};
