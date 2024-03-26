import { Comment, Post, Notification } from '../mongo';
import { NewComment } from '../types';
import SocketManager from '../utils/SocketManager';

const getParentCommentsByPostId = async (postId: string) => {
  const comments = await Comment.find({ post: postId })
    .where('parentComment')
    .exists(false)
    .populate('author', 'username');

  return comments;
};

const getRepliesByParentCommentId = async (parentCommentId: string) => {
  const parentComment = await Comment.findById(parentCommentId);

  if (!parentComment) {
    throw new Error('Parent comment not found');
  }

  const replies = await Comment
    .find({ parentComment: parentCommentId })
    .populate('author', 'username');

  return replies;
};

const addComment = async (commentFields: NewComment) => {
  const post = await Post.findById(commentFields.post);

  const newComment = await Comment.create(commentFields);

  post.comments = [...post.comments, newComment.id];

  // eslint-disable-next-line no-extra-boolean-cast
  if (Boolean(commentFields.parentComment)) {
    const parentComment = await Comment.findById(commentFields.parentComment);

    if (!parentComment) {
      throw new Error('comment not found');
    }

    parentComment.replies = [...parentComment.replies, newComment.id];

    await parentComment.save();
  }

  if (post.creator.toString() !== newComment.author.toString()) {
    await Notification.create({
      type: 'comment',
      entity: {
        id: post.id,
        model: 'Post',
      },
      originEntity: {
        id: newComment.id,
        model: 'Comment',
      },
      creator: newComment.author,
      recipient: post.creator,
    });

    SocketManager.getInstance().emitNotification(post.creator.toString(), 'comment');
  }

  await post.save();
};

const deleteCommentById = async (id: string) => {
  const commentToDelete = await Comment.findById(id);

  if (!commentToDelete) {
    throw new Error('Comment not found');
  }

  await commentToDelete.remove();
};

export default {
  addComment,
  getParentCommentsByPostId,
  getRepliesByParentCommentId,
  deleteCommentById,
};
