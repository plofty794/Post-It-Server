import { Schema, model } from 'mongoose';

const upvoteSchema = new Schema(
  {
    post: { type: Schema.Types.ObjectId, ref: 'Posts', required: true },
    upvotedBy: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
  },
  { timestamps: true }
);

const UpvotePostSchema = model('Upvotes', upvoteSchema);

export default UpvotePostSchema;
