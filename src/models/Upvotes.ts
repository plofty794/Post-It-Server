import DownvotePostSchema from '@schemas/DownvoteSchema';
import NotificationSchema from '@schemas/NotificationSchema';
import PostSchema from '@schemas/PostSchema';
import UpvotePostSchema from '@schemas/UpvoteSchema';
import { eventEmitter } from '@utils/events/events';

export default {
  getYourPostUpvotes: async (userID: string, page: number, limit: number) => {
    try {
      const postUpvotes = await UpvotePostSchema.find({
        upvotedBy: userID,
      })
        .populate([
          {
            path: 'post',
            populate: 'author upvote',
          },
        ])
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: 'desc', upvote: 'asc' })
        .exec();

      if (!postUpvotes.length) {
        throw new Error("You've reached the end.");
      }

      return postUpvotes;
    } catch (error) {
      return error as Error;
    }
  },

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

      const upvote = await UpvotePostSchema.create({
        post: postID,
        upvotedBy,
      });

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

      await upvote.populate([
        {
          path: 'post',
          populate: 'author upvote',
        },
      ]);

      return { message: 'Upvote updated.', upvote };
    } catch (error) {
      return error as Error;
    }
  },
};
