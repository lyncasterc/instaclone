import {
  Like,
  Post,
  Comment,
  Notification,
} from '../mongo';
import { NewLike } from '../types';
import SocketManager from '../utils/SocketManager';

const addLike = async (newLikeFields: NewLike) => {
  let entity;
  let entityCreatorId: string | undefined;

  if (newLikeFields.entityModel === 'Post') {
    entity = await Post.findById(newLikeFields.entityId);
    entityCreatorId = entity?.creator.toString();
  } else if (newLikeFields.entityModel === 'Comment') {
    entity = await Comment.findById(newLikeFields.entityId);
    entityCreatorId = entity?.author.toString();
  }

  if (!entity || !entityCreatorId) {
    throw new Error('Entity not found');
  }

  const existingLike = await Like.findOne({
    'likedEntity.id': newLikeFields.entityId,
    user: newLikeFields.userId,
  });

  if (existingLike) {
    throw new Error('Can not like the same entity twice');
  }

  const newLike = await Like.create({
    user: newLikeFields.userId,
    likedEntity: {
      id: newLikeFields.entityId,
      model: newLikeFields.entityModel,
    },
  });

  // users liking their own entities should not receive notifications
  if (newLikeFields.userId !== entityCreatorId) {
    const postId = newLikeFields.entityModel === 'Post'
      ? newLikeFields.entityId
      : entity?.post.toString();

    await Notification.create({
      type: 'like',
      likeContextType: newLikeFields.entityModel,
      entity: {
        id: postId,
        model: 'Post',
      },
      originEntity: {
        id: newLike._id,
        model: 'Like',
      },
      creator: newLikeFields.userId,
      recipient: entityCreatorId,
    });

    SocketManager.getInstance().emitNotification(entityCreatorId, 'like');
  }
};

const removeLikeByUserIdAndEntityId = async (
  { user, entityId } : { user: string, entityId: string, },
) => {
  const deletedLike = await Like.findOneAndDelete({
    'likedEntity.id': entityId,
    user,
  });

  await Notification.deleteOne({
    'originEntity.id': deletedLike?._id,
    'originEntity.model': 'Like',
    creator: user,
    type: 'like',
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
