import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    minlength: [2, 'Name is too short!'],
    required: [true, 'Name is required!'],
  },
  username: {
    type: String,
    minlength: [3, 'Username is too short!'],
    required: [true, 'Username is required!'],
  },
  email: {
    type: String,
    minlength: [3, 'Username is too short!'],
    required: [true, 'Username is required!'],
  },
  passwordHash: {
    type: String,
    required: [true, 'Password is required!'],
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },
  ],
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  image: String,
});

userSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export default mongoose.model('User', userSchema);
