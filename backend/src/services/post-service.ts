import { Post } from '../mongo';
import { NewPost, ProofedUpdatedPost } from '../types';
import cloudinary from '../utils/cloudinary';

const getPost = async (id: string) => {
  const post = await Post.findById(id)
    .populate('creator', { username: 1, image: 1 });

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

const deletePostById = async (id: string, requester: string) => {
  const deletedPost = await Post.findById(id);

  if (!deletedPost) {
    throw new Error('Post not found');
  }

  if (requester !== deletedPost.creator.toString()) {
    throw new Error('Unauthorized');
  }

  await cloudinary.destroy(deletedPost.image.publicId);
  await deletedPost.remove();
};

export default {
  getPost,
  addPost,
  updatePostById,
  deletePostById,
};
