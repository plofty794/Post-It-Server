import { Schema, model } from 'mongoose';

const commentSchema = new Schema(
  {
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    post: { type: Schema.Types.ObjectId, ref: 'Posts', required: true },
    parentComment: { type: Schema.Types.ObjectId, ref: 'Comments', default: null },
    replies: [{ type: Schema.Types.ObjectId, ref: 'Comments' }],
    upvotes: {
      type: [String],
    },
    downvotes: {
      type: [String],
    },
    upvoteCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const CommentSchema = model('Comments', commentSchema);

export default CommentSchema;
