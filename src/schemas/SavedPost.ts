import { Schema, model } from 'mongoose';

const savePostSchema = new Schema(
  {
    post: { type: Schema.Types.ObjectId, ref: 'Posts', required: true },
    savedBy: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
  },
  { timestamps: true }
);

const SavedPostSchema = model('SavedPosts', savePostSchema);

export default SavedPostSchema;
