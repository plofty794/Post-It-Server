import { Schema, model } from 'mongoose';

const hiddenPostSchema = new Schema(
  {
    post: { type: Schema.Types.ObjectId, ref: 'Posts', required: true },
    hiddenBy: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
  },
  { timestamps: true }
);

const HiddenPostSchema = model('HiddenPosts', hiddenPostSchema);

export default HiddenPostSchema;
