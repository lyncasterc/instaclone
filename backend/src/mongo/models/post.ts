import mongoose from 'mongoose';
import { Comment } from '../index';

export const imageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
  },
);

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
    likes: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
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

postSchema.pre('remove', async function deleteAllCommentsOfPost(next) {
  const post = this;

  await Comment.deleteMany({ post: post._id });
  next();
});

export default mongoose.model('Post', postSchema);
