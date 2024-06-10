import HiddenPostSchema from '@schemas/HiddenPostSchema';
import PostSchema from '@schemas/PostSchema';
import UserSchema from '@schemas/UserSchema';
import { isValidObjectId } from 'mongoose';

export default {
  createPost: async (userID: string, title: string, body: string) => {
    try {
      const escapedTitle = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

      const titleAlreadyTaken = await PostSchema.findOne({
        title: {
          $regex: new RegExp('^' + escapedTitle + '$', 'i'),
        },
      });

      if (titleAlreadyTaken) {
        throw new Error('Post title is already taken.');
      }

      const newPost = await PostSchema.create({
        author: userID,
        title,
        body,
      });

      await UserSchema.findByIdAndUpdate(userID, {
        $push: {
          posts: [newPost._id],
        },
      });

      return newPost;
    } catch (error) {
      return error as Error;
    }
  },

  editPost: async (postID: string, title: string, body: string) => {
    try {
      const post = await PostSchema.findByIdAndUpdate(postID, {
        title,
        body,
      });

      if (!post) {
        throw new Error('Post not found.');
      }

      return { message: 'Post has been edited.' };
    } catch (error) {
      return error as Error;
    }
  },

  deletePost: async (postID: string) => {
    try {
      const post = await PostSchema.findById(postID);

      if (!post) {
        throw new Error('Post not found.');
      }

      await post.deleteOne();

      return { message: 'Post has been deleted.' };
    } catch (error) {
      return error as Error;
    }
  },

  getPosts: async (userID: string, page: number, limit: number) => {
    try {
      const hiddenPosts = await HiddenPostSchema.find({
        hiddenBy: userID,
      });

      const posts = await PostSchema.find({
        _id: {
          $nin: hiddenPosts.map(hiddenPost => hiddenPost.post),
        },
      })
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: 'desc', upvote: 'asc' })
        .populate([
          {
            path: 'author',
            select: 'username profilePicUrl',
          },
          {
            path: 'upvote',
          },
          {
            path: 'downvote',
          },
        ])
        .exec();

      if (!posts.length) {
        throw new Error("You've reached the end.");
      }

      return posts;
    } catch (error) {
      return error as Error;
    }
  },

  getPost: async (postID: string, userID?: string) => {
    try {
      if (!isValidObjectId(postID)) {
        throw new Error('No post found. Invalid post id.');
      }

      const post = await PostSchema.findById(postID)
        .populate([
          {
            path: 'author',
            select: 'username profilePicUrl',
          },
          {
            path: 'upvote',
          },
          {
            path: 'downvote',
          },
        ])
        .exec();

      if (!post) {
        throw new Error('No post found.');
      }

      const isHiddenPost = await HiddenPostSchema.findOne({
        hiddenBy: userID,
        post: postID,
      });

      if (isHiddenPost) {
        throw new Error("You've hidden this post.");
      }

      return post;
    } catch (error) {
      return error as Error;
    }
  },

  getYourPosts: async (userID: string, page: number, limit: number) => {
    try {
      const posts = await PostSchema.find({
        author: userID,
      })
        .populate([
          { path: 'author', select: 'username profilePicUrl savedPosts hiddenPosts' },
          {
            path: 'upvote',
          },
          {
            path: 'downvote',
          },
        ])
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
