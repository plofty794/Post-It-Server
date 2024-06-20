import { CallbackError, Schema, model } from 'mongoose';
import UpvotePostSchema from './UpvoteSchema';
import DownvotePostSchema from './DownvoteSchema';
import CommentSchema from './CommentSchema';
import UserSchema from './UserSchema';
import SavedPostSchema from './SavedPostSchema';
import HiddenPostSchema from './HiddenPostSchema';
import NotificationSchema from './NotificationSchema';

const postSchema = new Schema(
  {
    title: {
      type: String,
      unique: true,
      trim: true,
      sparse: true,
    },
    body: {
      type: String,
      required: true,
    },
    author: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    upvote: [{ type: Schema.Types.ObjectId, ref: 'Upvotes' }],
    downvote: [{ type: Schema.Types.ObjectId, ref: 'Downvotes' }],
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comments' }],
    upvoteCount: { type: Number, min: 0, default: 0 },
  },
  { timestamps: true }
);

postSchema.pre('deleteOne', { document: false, query: true }, async function (next) {
  try {
    const doc = await this.model.findOne(this.getFilter());
    const savedPost = await SavedPostSchema.findOneAndDelete({
      post: doc._id,
    });
    const hiddenPost = await HiddenPostSchema.findOneAndDelete({
      post: doc._id,
    });

    await Promise.all([
      NotificationSchema.deleteMany({
        post: doc._id,
      }),
      CommentSchema.deleteMany({
        post: doc._id,
      }),
      UpvotePostSchema.deleteMany({
        post: doc._id,
      }),
      DownvotePostSchema.deleteMany({
        post: doc._id,
      }),
      UserSchema.findByIdAndUpdate(doc.author, {
        $pull: {
          posts: doc._id,
          savedPosts: savedPost?._id,
          hiddenPosts: hiddenPost?._id,
        },
      }),
    ]);
    next();
  } catch (error) {
    next(error as CallbackError);
  }
});

const PostSchema = model('Posts', postSchema);
export default PostSchema;
