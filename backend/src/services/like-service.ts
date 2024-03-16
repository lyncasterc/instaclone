import {
  Like, Post, Comment,
} from '../mongo';
import { NewLike } from '../types';

const addLike = async (newLikeFields: NewLike) => {
  let entity;

  if (newLikeFields.entityModel === 'Post') {
    entity = await Post.findById(newLikeFields.entityId);
  } else if (newLikeFields.entityModel === 'Comment') {
    entity = await Comment.findById(newLikeFields.entityId);
  }

  if (!entity) {
    throw new Error('Entity not found');
  }

  const existingLike = await Like.findOne({
    'likedEntity.id': newLikeFields.entityId,
    user: newLikeFields.userId,
  });

  if (existingLike) {
    throw new Error('Can not like the same entity twice');
  }

  await Like.create({
    user: newLikeFields.userId,
    likedEntity: {
      id: newLikeFields.entityId,
      model: newLikeFields.entityModel,
    },
  });
};

const removeLikeByUserIdAndEntityId = async (
  { user, entityId } : { user: string, entityId: string, },
) => {
  await Like.findOneAndDelete({
    'likedEntity.id': entityId,
    user,
  });
};

const getLikeCountByEntityId = async (entityId: string) => {
  const likeCount = await Like.countDocuments({
    'likedEntity.id': entityId,
  });

  return likeCount;
};

const getLikeUsersByEntityId = async (entityId: string) => {
  const likes = await Like.find({
    'likedEntity.id': entityId,
  }).populate('user', 'username');

  return likes.map((like) => like.user);
};

const hasUserLikedEntity = async (userId: string, entityId: string) => {
  const like = await Like.findOne({
    'likedEntity.id': entityId,
    user: userId,
  });

  return !!like;
};

export default {
  addLike,
  removeLikeByUserIdAndEntityId,
  getLikeCountByEntityId,
  getLikeUsersByEntityId,
  hasUserLikedEntity,
};
