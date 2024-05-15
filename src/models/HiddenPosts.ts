import HiddenPostSchema from '@schemas/HiddenPost';
import UserSchema from '@schemas/UserSchema';

export default {
  getYourHiddenPosts: async (userID: string, page: number, limit: number) => {
    try {
      const hiddenPosts = await HiddenPostSchema.find({
        hiddenBy: userID,
      })
        .populate({
          path: 'post',
          populate: {
            path: 'author',
            select: 'username profilePicUrl',
          },
        })
        .populate('post')
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: 'desc', upvote: 'asc' })
        .exec();

      if (!hiddenPosts.length) {
        throw new Error("You've reached the end.");
      }

      return hiddenPosts;
    } catch (error) {
      return error as Error;
    }
  },

  hidePost: async (hiddenBy: string, postID: string) => {
    try {
      const hiddenPost = await HiddenPostSchema.create({
        hiddenBy,
        post: postID,
      });

      await UserSchema.findByIdAndUpdate(hiddenBy, {
        $push: {
          hiddenPosts: [hiddenPost._id],
        },
      });

      return { message: 'Post has been hidden.' };
    } catch (error) {
      return error as Error;
    }
  },

  unHidePost: async (unHiddenBy: string, postID: string) => {
    try {
      const unHiddenPost = await HiddenPostSchema.findOneAndDelete({
        post: postID,
        hiddenBy: unHiddenBy,
      });

      await UserSchema.findByIdAndUpdate(unHiddenBy, {
        $pull: {
          hiddenPosts: {
            $in: [unHiddenPost?._id],
          },
        },
      });

      return { message: 'Post has been unhidden.' };
    } catch (error) {
      return error as Error;
    }
  },
};
