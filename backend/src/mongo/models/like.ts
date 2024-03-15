import mongoose from 'mongoose';

const likeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  likedEntity: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'model',
    },
    model: {
      type: String,
      required: true,
      enum: ['Post', 'Comment'],
    },
  },
}, {
  timestamps: true,
});

likeSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export default mongoose.model('Like', likeSchema);
