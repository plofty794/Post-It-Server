import HiddenPostSchema from '@schemas/HiddenPostSchema';
import UserSchema from '@schemas/UserSchema';

export default {
  getYourHiddenPosts: async (userID: string, page: number, limit: number) => {
    try {
      const hiddenPosts = await HiddenPostSchema.find({
        hiddenBy: userID,
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
      await HiddenPostSchema.create({
        hiddenBy,
        post: postID,
      });

      await UserSchema.findByIdAndUpdate(hiddenBy, {
        $push: {
          hiddenPosts: [postID],
        },
      });

      return { message: 'Post has been hidden.' };
    } catch (error) {
      return error as Error;
    }
  },

  unHidePost: async (unHiddenBy: string, postID: string) => {
    try {
      await HiddenPostSchema.findOneAndDelete({
        post: postID,
        hiddenBy: unHiddenBy,
      });

      await UserSchema.findByIdAndUpdate(unHiddenBy, {
        $pull: {
          hiddenPosts: {
            $in: [postID],
          },
        },
      });

      return { message: 'Post has been unhidden.' };
    } catch (error) {
      return error as Error;
    }
  },
};
