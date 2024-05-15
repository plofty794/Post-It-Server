import PostSchema from '@schemas/PostSchema';
import DownvoteSchema from '@schemas/DownvoteSchema';
import UpvotePostSchema from '@schemas/UpvoteSchema';

export default {
  updateDownvotes: async (postID: string, downvotedBy: string) => {
    try {
      const downvoteExist = await DownvoteSchema.findOneAndDelete({
        post: postID,
        downvotedBy,
      });

      const post = await PostSchema.findOne({
        _id: postID,
        upvoteCount: {
          $gt: 0,
        },
      });

      if (!post) {
        throw new Error("Error down voting post. Either upvote is currently zero or post doesn't exist.");
      }

      const upvoteExist = await UpvotePostSchema.findOneAndDelete({
        post: postID,
        upvotedBy: downvotedBy,
      });

      await post.updateOne({
        $pull: {
          upvote: upvoteExist?._id,
        },
      });

      if (downvoteExist) {
        await post?.updateOne({
          $pull: {
            downvote: downvoteExist._id,
          },
          $inc: {
            upvoteCount: -1,
          },
        });
      } else {
        const downvote = await DownvoteSchema.create({
          post: postID,
          downvotedBy,
        });

        await post?.updateOne({
          $inc: {
            upvoteCount: -1,
          },
          $push: {
            downvote: [downvote._id],
          },
        });
      }

      return { message: 'Downvote updated.' };
    } catch (error) {
      return error as Error;
    }
  },
};
