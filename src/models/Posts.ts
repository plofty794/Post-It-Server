import PostSchema from '@schemas/PostSchema';
import SavedPostSchema from '@schemas/SavedPost';
import UserSchema from '@schemas/UserSchema';

export default {
  createPost: async (userID: string, title: string, body: string) => {
    try {
      const newPost = await PostSchema.create({
        author: userID,
        title,
        body,
      });
      return newPost;
    } catch (error) {
      return error as Error;
    }
  },

  getPosts: async (userID: string, page: number, limit: number) => {
    try {
      const user = await UserSchema.findById(userID);

      const posts = await PostSchema.find({
        _id: {
          $nin: [user?.hiddenPosts],
        },
      })
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: 'desc', upvote: 'asc' })
        .populate({
          path: 'author',
          select: 'username profilePicUrl savedPosts',
        })
        .exec();

      if (!posts.length) {
        throw new Error("You've reached the end.");
      }

      return posts;
    } catch (error) {
      return error as Error;
    }
  },

  getYourPosts: async (userID: string, page: number, limit: number) => {
    try {
      const posts = await PostSchema.find({
        author: userID,
      })
        .populate({ path: 'author', select: 'username profilePicUrl savedPosts' })
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: 'desc', upvote: 'asc' })
        .exec();

      if (!posts.length) {
        throw new Error("You've reached the end.");
      }

      return posts;
    } catch (error) {
      return error as Error;
    }
  },
};
