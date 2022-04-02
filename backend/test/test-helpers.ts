import { User } from '../src/mongo';

const usersInDB = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

export default {
  usersInDB,
};
