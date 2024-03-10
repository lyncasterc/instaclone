import mongoose from 'mongoose';
import { Post } from '../index';

const commentSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: [true, 'Comment must have a post.'],
    },
    body: {
      type: String,
      required: true,
      maxlength: [2200, 'Comment body can not be greater than 2200 characters.'],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
    replies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
  },
  {
    timestamps: true,
  },
);

// if comment is a parent comment, delete all its replies
commentSchema.pre('remove', async function deleteAllRepliesOfParentComment(next) {
  const comment = this;
  const post = await Post.findById(comment.post);
  const parentComment = await comment.model('Comment').findById(comment.parentComment);

  await comment.model('Comment').deleteMany({ parentComment: comment._id });

  post.comments = post.comments.filter(
    (c: mongoose.Schema.Types.ObjectId) => c.toString() !== comment._id.toString(),
  );

  if (parentComment) {
    parentComment.replies = parentComment.replies.filter(
      (c: mongoose.Schema.Types.ObjectId) => c.toString() !== comment._id.toString(),
    );

    await parentComment.save();
  }

  await post.save();

  next();
});

commentSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export default mongoose.model('Comment', commentSchema);
