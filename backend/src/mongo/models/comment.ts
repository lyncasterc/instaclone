import mongoose from 'mongoose';

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

commentSchema.pre('remove', async function handleCommentDeletion(next) {
  const thisComment = this;
  const Post = this.model('Post');
  const post = await Post.findById(thisComment.post);
  const isThisCommentAReply = Boolean(thisComment.parentComment);
  let deletedCommentsIds = [thisComment._id.toString()];

  // if this comment is a reply, remove it from its parent comment's replies
  if (isThisCommentAReply) {
    const parentComment = await thisComment.model('Comment').findById(thisComment.parentComment);

    parentComment.replies = parentComment.replies.filter(
      (c: mongoose.Schema.Types.ObjectId) => c.toString() !== thisComment._id.toString(),
    );

    await parentComment.save();
  } else {
    // else if this comment is a parent comment, delete all its replies

    const replies = await thisComment.model('Comment').find({ parentComment: thisComment._id });

    if (replies.length > 0) {
      deletedCommentsIds = [
        ...deletedCommentsIds,
        ...replies.map((reply: { _id: mongoose.Schema.Types.ObjectId }) => reply._id.toString()),
      ];

      await thisComment.model('Comment').deleteMany({ parentComment: thisComment._id });
    }
  }

  post.comments = post.comments.filter(
    (
      commentId: mongoose.Schema.Types.ObjectId,
    ) => !deletedCommentsIds.includes(commentId.toString()),
  );

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
