import bcyrpt from 'bcrypt';
import { ObjectId } from 'mongoose';
import { User } from '../mongo';
import { NewUser, ProofedUpdatedUser } from '../types';

const getUsers = async () => {
  // TODO: figure out if post id is populated by default.
  // TODO: decide which are and populate the fields that should be populated.
  const users = await User.find({})
    .populate('posts', { image: 1 });

  return users;
};

const getUserById = async (id: string) => {
  const user = await User.findById(id)
    .populate('posts', { image: 1 });
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

const updateUserById = async (user: ProofedUpdatedUser, id: string) => {
  let passwordHash;
  const updatedUser: any = { ...user };

  if (user.password) {
    passwordHash = await bcyrpt.hash(user.password, 10);
    updatedUser.passwordHash = passwordHash;
  }

  // FIXME: Pretty sure this can be in the if block above ^
  delete updatedUser.password;

  const savedUpdatedUser = await User.findByIdAndUpdate(id, updatedUser, { new: true })
    .populate('posts', { image: 1 });

  return savedUpdatedUser;
};

const followUserById = async (followerId: string, followedUserId: string) => {
  const followedUser = await User.findById(followedUserId);
  const follower = await User.findById(followerId);

  if (!followedUser) throw new Error('User not found.');

  // checking if user already follows the user they are requesting to follow
  if (follower.following.map((ids: ObjectId) => ids?.toString()).includes(followedUser.id)) throw new Error('You already follow that user!');

  followedUser.followers = [...followedUser.followers, follower];
  follower.following = [...follower.following, followedUser.id];

  await followedUser.save();
  await follower.save();

  return followedUser;
};

export default {
  getUsers,
  getUserById,
  addUser,
  updateUserById,
  followUserById,
};