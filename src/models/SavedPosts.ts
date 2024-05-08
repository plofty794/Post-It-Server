import PostSchema from '@schemas/PostSchema';
import SavedPostSchema from '@schemas/SavedPostSchema';
import UserSchema from '@schemas/UserSchema';

export default {
  getYourSavedPosts: async (userID: string, page: number, limit: number) => {
    try {
      const savedPosts = await SavedPostSchema.find({
        savedBy: userID,
      })
        .populate('post')
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: 'desc', upvote: 'asc' })
        .exec();

      if (!savedPosts.length) {
        throw new Error("You've reached the end.");
      }

      return savedPosts;
    } catch (error) {
      return error as Error;
    }
  },

  savePost: async (savedBy: string, postID: string) => {
    try {
      const post = await PostSchema.findById(postID);

      if (!post) {
        throw new Error('No post found.');
      }

      await SavedPostSchema.create({
        savedBy,
        post: postID,
      });

      await UserSchema.findByIdAndUpdate(savedBy, {
        $push: {
          savedPosts: [postID],
        },
      });

      return { message: 'Post has been saved.', savedPost: post };
    } catch (error) {
      return error as Error;
    }
  },

  unSavePost: async (unSavedBy: string, postID: string) => {
    try {
      await SavedPostSchema.findOneAndDelete({
        post: postID,
        savedBy: unSavedBy,
      });

      await UserSchema.findByIdAndUpdate(unSavedBy, {
        $pull: {
          savedPosts: {
            $in: [postID],
          },
        },
      });

      return { message: 'Post has been unsaved.' };
    } catch (error) {
      return error as Error;
    }
  },
};
