import DownvotePostSchema from '@schemas/DownvoteSchema';
import NotificationSchema from '@schemas/NotificationSchema';
import PostSchema from '@schemas/PostSchema';
import UpvotePostSchema from '@schemas/UpvoteSchema';
import { eventEmitter } from '@utils/events/events';

export default {
  updateUpvotes: async (postID: string, upvotedBy: string) => {
    try {
      const post = await PostSchema.findById(postID);

      if (!post) {
        throw new Error("Error down voting post. Either upvote is currently zero or post doesn't exist.");
      }

      const isNotAuthorUpvote = post.author.toString() !== upvotedBy;

      const upvoteExist = await UpvotePostSchema.findOneAndDelete({
        post: postID,
        upvotedBy,
      });

      if (upvoteExist) {
        await Promise.all([
          post?.updateOne({
            $pull: {
              upvote: upvoteExist._id,
            },
            $inc: {
              upvoteCount: -1,
            },
          }),
          NotificationSchema.deleteOne({
            post: postID,
            sender: upvotedBy,
            type: 'postUpvote',
          }),
        ]);

        return { message: 'Upvote updated.' };
      }

      const downvoteExist = await DownvotePostSchema.findOneAndDelete({
        post: postID,
        downvotedBy: upvotedBy,
      });

      const upvote = await UpvotePostSchema.create({
        post: postID,
        upvotedBy,
      });

      if (downvoteExist) {
        await Promise.all([
          post.updateOne({
            $pull: {
              downvote: downvoteExist._id,
            },
          }),
          NotificationSchema.deleteOne({
            post: postID,
            sender: upvotedBy,
            type: 'postDownvote',
          }),
        ]);
      }

      isNotAuthorUpvote &&
        (await NotificationSchema.create({
          type: 'postUpvote',
          data: upvote._id,
          sender: upvotedBy,
          recipient: post.author,
          post: postID,
          docModel: 'Upvotes',
        }));

      isNotAuthorUpvote && eventEmitter.emit('new-notification', post.author.toString());

      await post.updateOne({
        $inc: {
          upvoteCount: 1,
        },
        $push: {
          upvote: [upvote._id],
        },
      });

      return { message: 'Upvote updated.' };
    } catch (error) {
      return error as Error;
    }
  },
};
