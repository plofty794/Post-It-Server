import { Schema, model } from 'mongoose';

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    author: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    upvote: { type: Number, default: 0 },
    downvote: { type: Number, default: 0 },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comments' }],
  },
  { timestamps: true }
);

const PostSchema = model('Posts', postSchema);

export default PostSchema;
