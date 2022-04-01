import mongoose from 'mongoose';

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
      type: String,
      required: true,
    },
    comments: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
    likes: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true },
);

export default mongoose.model('Post', postSchema);
