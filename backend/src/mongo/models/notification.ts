/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/space-before-function-paren */
/* eslint-disable object-shorthand */
import mongoose, { Document, Types } from 'mongoose';
import { NotificationType } from '../../types';

/**
 * Interface for notification documents.
 */
interface INotification extends Document {
  /** Defines the type of notification. */
  type: NotificationType;
  /** Specifies the context for a "like" notification. */
  likeContextType?: 'Post' | 'Comment';
  /** `entity.id`: ID of the entity the notification links to.
   * For example, a like notification on a post or comment both link to the post entity
   * that they belong to.
   *
   * `entity.model`: Model of the entity the notification is about. `Post` or `User`.
  */
  entity: {
    id: Types.ObjectId;
    model: 'Post' | 'User';
  },
  /**
   * The entity whose creation triggered the notification.
   *
   * `originEntity.id`: ID of the entity that triggered the notification.
   *
   * `originEntity.model`: Model of the entity that triggered the notification.
   * Can be `Like` or `Comment`.
   *
   *For example:

   *For likes, the `originEntity` is the `Like` document itself.
   * The creation of a new Like triggers a notification.
   *
   * For comments, the originEntity is the `Comment` document itself.
   *
   * Follows do not have an `originEntity` because the follow action does not create a new entity.
   */
  originEntity?: {
    id: Types.ObjectId;
    model: 'Like' | 'Comment';
  }
  /** ID of the user who created the notification. */
  creator: Types.ObjectId;
  /** ID of the user who is the recipient of the notification. */
  recipient: Types.ObjectId;
  /** Indicates whether the notification has been read. False by default */
  hasBeenRead: boolean;
}

const notificationSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['like', 'comment', 'follow'],
  },
  likeContextType: {
    type: String,
    enum: ['Post', 'Comment'],
    required: function() {
      const thisNotification = this as { type: string };
      return thisNotification.type === 'like';
    },
  },
  entity: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'model',
    },
    model: {
      type: String,
      required: true,
      enum: ['Post', 'User'],
    },
  },
  originEntity: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      required: function() {
        const thisNotification = this as { type: string };
        return thisNotification.type === 'like' || thisNotification.type === 'comment';
      },
      refPath: 'originEntity.model',
    },
    model: {
      type: String,
      required: function() {
        const thisNotification = this as { type: string };
        return thisNotification.type === 'like' || thisNotification.type === 'comment';
      },
      enum: ['Like', 'Comment'],
    },
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  hasBeenRead: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

notificationSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export default mongoose.model<INotification>('Notification', notificationSchema);
