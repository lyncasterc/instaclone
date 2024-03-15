import mongoose from 'mongoose';
import imageSchema from './image-schema';

const postSchema = new mongoose.Schema(
  {
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Post needs a valid creator.'],
    },
    caption: {
      type: String,
      maxlength: [2200, 'Caption can not be greater than 2200 characters.'],
    },
    image: {
      type: imageSchema,
      required: true,
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
  },
  { timestamps: true },
);

postSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

postSchema.pre('remove', async function handlePostDeletion(next) {
  const thisPost = this;
  const Comment = this.model('Comment');
  const Like = this.model('Like');
  let postCommentIds = await Comment.find({ post: thisPost._id }).select('_id');

  postCommentIds = postCommentIds.map(
    (comment: { _id: mongoose.Schema.Types.ObjectId }) => comment._id.toString(),
  );

  await Comment.deleteMany({ post: thisPost._id });
  await Like.deleteMany({ 'likedEntity.id': thisPost._id, 'likedEntity.model': 'Post' });
  await Like.deleteMany({ 'likedEntity.id': { $in: postCommentIds }, 'likedEntity.model': 'Comment' });

  next();
});

export default mongoose.model('Post', postSchema);
