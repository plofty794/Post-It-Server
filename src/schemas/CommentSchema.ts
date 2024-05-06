import { Schema, model } from 'mongoose';

const commentSchema = new Schema(
  {
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    post: { type: Schema.Types.ObjectId, ref: 'Posts', required: true },
    parentComment: { type: Schema.Types.ObjectId, ref: 'Comments', default: null },
    replies: [{ type: Schema.Types.ObjectId, ref: 'Comments' }],
  },
  { timestamps: true }
);

const CommentSchema = model('Comments', commentSchema);

export default CommentSchema;
