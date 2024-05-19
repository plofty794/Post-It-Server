import { Schema, model } from 'mongoose';

const notificationSchema = new Schema(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['postUpvote', 'postDownvote', 'commentUpvote', 'commentDownvote', 'reply', 'comment'],
      required: true,
    },
    sender: { type: Schema.Types.ObjectId, ref: 'Users' },
    post: { type: Schema.Types.ObjectId, ref: 'Posts' },
    data: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: 'docModel',
    },
    read: {
      type: Boolean,
      default: false,
    },
    docModel: {
      type: String,
      required: true,
      enum: ['Comments', 'Upvotes', 'Downvotes'],
    },
  },
  { timestamps: true }
);

const NotificationSchema = model('Notifications', notificationSchema);

export default NotificationSchema;
