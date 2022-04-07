import { Post } from '../mongo';
// TODO: figure out what exactly needs to be populated.
const getPost = async (id: string) => {
  const post = await Post.findById(id)
    .populate('creator', { username: 1, image: 1 })
    .populate('comments');

  return post;
};

export default {
  getPost,
};
