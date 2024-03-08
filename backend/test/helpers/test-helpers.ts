import bcrypt from 'bcrypt';
import { User, Post } from '../../src/mongo';
import { NewUser } from '../../src/types';

const usersInDB = async () => {
  const users = await User.find({}).select('-passwordHash');
  return users.map((user) => user.toJSON());
};

const createTestUser = async (user: NewUser) => {
  const passwordHash = await bcrypt.hash(user.password, 10);
  const testUser = new User({
    fullName: user.fullName,
    username: user.username,
    email: user.email,
    passwordHash,
  });
  const savedUser = (await testUser.save()).toJSON();
  return savedUser;
};

const postsInDB = async () => {
  const posts = await Post.find({});
  return posts.map((post) => post.toJSON());
};

export default {
  usersInDB,
  createTestUser,
  postsInDB,
};
