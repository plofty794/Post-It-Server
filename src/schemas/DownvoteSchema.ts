import { Schema, model } from 'mongoose';

const downvoteSchema = new Schema(
  {
    post: { type: Schema.Types.ObjectId, ref: 'Posts', required: true },
    downvotedBy: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
  },
  { timestamps: true }
);

const DownvotePostSchema = model('Downvotes', downvoteSchema);

export default DownvotePostSchema;
