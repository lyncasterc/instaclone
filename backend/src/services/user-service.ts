import bcyrpt from 'bcrypt';
import { User } from '../mongo';
import { NewUser } from '../types';

const getUsers = async () => {
  // TODO: figure out if post id is populated by default.
  // TODO: decide which are and populate the fields that should be populated.
  const users = await User.find({})
    .populate('posts', { image: 1 });

  return users;
};

const getUserById = async (id: string) => {
  const user = await User.findById(id);
  return user;
};

const addUser = async (user: NewUser) => {
  const existingUser = await User.findOne({ username: user.username });
  if (existingUser) throw new Error('That username is already taken!');
  if (user.password.length < 5) throw new Error('Password is too short!');

  const passwordHash = await bcyrpt.hash(user.password, 10);

  const newUser = new User({
    fullName: user.fullName,
    username: user.username,
    email: user.email,
    passwordHash,
  });

  const savedNewUser = await newUser.save();
  return savedNewUser;
};

export default {
  getUsers,
  getUserById,
  addUser,
};
