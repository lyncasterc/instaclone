import { User } from '../mongo';

const getUsers = async () => {
  const users = await User.find({})
    .populate('posts', { image: 1 });

  return users;
};

export default {
  getUsers,
};
