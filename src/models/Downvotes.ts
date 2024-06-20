import PostSchema from '@schemas/PostSchema';
import DownvoteSchema from '@schemas/DownvoteSchema';
import UpvotePostSchema from '@schemas/UpvoteSchema';
import NotificationSchema from '@schemas/NotificationSchema';
import { eventEmitter } from '@utils/events/events';

export default {
  getYourPostDownvotes: async (userID: string, page: number, limit: number) => {
    try {
      const postDownvotes = await DownvoteSchema.find({
        downvotedBy: userID,
      })
        .populate([
          {
            path: 'post',
            populate: 'author downvote',
          },
        ])
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: 'desc', upvote: 'asc' })
        .exec();

      if (!postDownvotes.length) {
        throw new Error("You've reached the end.");
      }

      return postDownvotes;
    } catch (error) {
      return error as Error;
    }
  },

  updateDownvotes: async (postID: string, downvotedBy: string) => {
    try {
      const post = await PostSchema.findOne({
        _id: postID,
        upvoteCount: {
          $gt: 0,
        },
      });

      if (!post) {
        throw new Error("Error down voting post. Either upvote is currently zero or post doesn't exist.");
      }

      const isNotAuthorDownvote = post.author.toString() !== downvotedBy;

      const downvoteExist = await DownvoteSchema.findOneAndDelete({
        post: postID,
        downvotedBy,
      });

      if (downvoteExist) {
        await Promise.all([
          post.updateOne({
            $pull: {
              downvote: downvoteExist._id,
            },
            $inc: {
              upvoteCount: 1,
            },
          }),
          NotificationSchema.deleteOne({
            post: postID,
            sender: downvotedBy,
            type: 'postUpvote',
          }),
        ]);

        return { message: 'Downvote updated.' };
      }

      const upvoteExist = await UpvotePostSchema.findOneAndDelete({
        post: postID,
        upvotedBy: downvotedBy,
      });

      const downvote = await DownvoteSchema.create({
        post: postID,
        downvotedBy,
      });

      if (upvoteExist) {
        await Promise.all([
          post.updateOne({
            $pull: {
              upvote: upvoteExist._id,
            },
          }),
          NotificationSchema.deleteOne({
            post: postID,
            sender: downvotedBy,
            type: 'postUpvote',
          }),
        ]);

        isNotAuthorDownvote &&
          (await NotificationSchema.create({
            type: 'postDownvote',
            data: downvote._id,
            sender: downvotedBy,
            recipient: post.author,
            post: postID,
            docModel: 'Downvotes',
          }));

        isNotAuthorDownvote && eventEmitter.emit('new-notification', post.author.toString());
      }

      await post.updateOne({
        $inc: {
          upvoteCount: -1,
        },
        $push: {
          downvote: [downvote._id],
        },
      });

      await downvote.populate([
        {
          path: 'post',
          populate: 'author downvote',
        },
      ]);

      return { message: 'Downvote updated.', downvote};
    } catch (error) {
      return error as Error;
    }
  },
};
