import { Post } from '../mongo';
import { NewPost, ProofedUpdatedPost } from '../types';
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

const updatePostById = async (
  updatedPostFields: ProofedUpdatedPost,
  id: string,
  creator: string,
) => {
  const updatedPost = await Post.findById(id);

  if (updatedPostFields.caption) {
    if (creator !== updatedPost.creator.toString()) throw new Error('Unauthorized');

    updatedPost.caption = updatedPostFields.caption;
  }
  if (updatedPostFields.comments) updatedPost.comments = updatedPostFields.comments;
  if (updatedPostFields.likes) updatedPost.likes = updatedPostFields.likes;

  await updatedPost.save();

  await updatedPost
    .populate([
      {
        path: 'creator',
        select: 'username image',
      },
      'comments',
    ]);

  return updatedPost;
};

export default {
  getPost,
  addPost,
  updatePostById,
};
