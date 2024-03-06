import bcyrpt from 'bcrypt';
import { ObjectId } from 'mongoose';
import { User } from '../mongo';
import { NewUser, UpdatedUserFields } from '../types';
import cloudinary from '../utils/cloudinary';

const getUsers = async () => {
  // TODO: decide which are and populate the fields that should be populated.
  const users = await User.find({})
    .select('-passwordHash')
    .populate({
      path: 'posts',
      select: 'image createdAt updatedAt creator',
      populate: {
        path: 'creator',
        select: 'username id image',
      },
    })
    .populate('followers', { username: 1 })
    .populate('following', { username: 1 });

  return users;
};

const getUserById = async (id: string) => {
  const user = await User.findById(id)
    .select('-passwordHash')
    .populate('posts', { image: 1 })
    .populate('followers', { username: 1 })
    .populate('following', { username: 1 });

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

const updateUserById = async (user: UpdatedUserFields, id: string) => {
  let passwordHash;
  const updatedUser: any = { ...user };

  if (user.password) {
    passwordHash = await bcyrpt.hash(user.password, 10);
    updatedUser.passwordHash = passwordHash;
    delete updatedUser.password;
  }

  const savedUpdatedUser = await User.findByIdAndUpdate(id, updatedUser, { new: true })
    .populate('posts', { image: 1 });

  return savedUpdatedUser;
};

const followUserById = async (followerId: string, followedUserId: string) => {
  const followedUser = await User.findById(followedUserId);
  const follower = await User.findById(followerId);

  if (!followedUser) {
    throw new Error('User not found.');
  }

  // checking if user already follows the user they are requesting to follow
  if (follower.following.map((ids: ObjectId) => ids?.toString()).includes(followedUser.id)) {
    throw new Error('You already follow that user!');
  }

  followedUser.followers = [...followedUser.followers, follower];
  follower.following = [...follower.following, followedUser.id];

  await followedUser.save();
  await follower.save();
};

const deleteUserImage = async (id: string) => {
  const user = await User.findById(id);
  cloudinary.destroy(user.image.publicId);
  user.image = null;
  await user.save();

  return user;
};

const unfollowUserById = async (followerId: string, followedUserId: string) => {
  const followedUser = await User.findById(followedUserId);
  const follower = await User.findById(followerId);

  if (!followedUser) {
    throw new Error('User not found.');
  }

  follower.following = follower.following.filter(
    (id: ObjectId) => id.toString() !== followedUser.id,
  );
  followedUser.followers = followedUser.followers.filter(
    (id: ObjectId) => id.toString() !== follower.id,
  );

  await follower.save();
  await followedUser.save();
};

export default {
  getUsers,
  getUserById,
  addUser,
  updateUserById,
  followUserById,
  deleteUserImage,
  unfollowUserById,
};
