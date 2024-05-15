import DownvotePostSchema from '@schemas/DownvoteSchema';
import PostSchema from '@schemas/PostSchema';
import UpvotePostSchema from '@schemas/UpvoteSchema';

export default {
  updateUpvotes: async (postID: string, upvotedBy: string) => {
    try {
      const upvoteExist = await UpvotePostSchema.findOneAndDelete({
        post: postID,
        upvotedBy,
      });

      const post = await PostSchema.findById(postID);

      if (!post) {
        throw new Error("Error down voting post. Either upvote is currently zero or post doesn't exist.");
      }

      const downvoteExist = await DownvotePostSchema.findOneAndDelete({
        post: postID,
        downvotedBy: upvotedBy,
      });

      await post.updateOne({
        $pull: {
          downvote: downvoteExist?._id,
        },
      });

      if (upvoteExist) {
        await post?.updateOne({
          $pull: {
            upvote: upvoteExist._id,
          },
          $inc: {
            upvoteCount: -1,
          },
        });
      } else {
        const upvote = await UpvotePostSchema.create({
          post: postID,
          upvotedBy,
        });

        await post?.updateOne({
          $inc: {
            upvoteCount: 1,
          },
          $push: {
            upvote: [upvote._id],
          },
        });
      }

      return { message: 'Upvote updated.' };
    } catch (error) {
      return error as Error;
    }
  },
};
