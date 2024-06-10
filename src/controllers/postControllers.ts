import Downvotes from '@models/Downvotes';
import HiddenPosts from '@models/HiddenPosts';
import Posts from '@models/Posts';
import SavedPosts from '@models/SavedPosts';
import Upvotes from '@models/Upvotes';
import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';

export const createPost = async (req: Request, res: Response, next: NextFunction) => {
  const { title, body } = req.body;
  try {
    if (typeof req.user === 'undefined') {
      throw createHttpError(400, 'This resource requires a logged in user.');
    }
    const newPost = await Posts.createPost(req.user, title, body);
    if (newPost instanceof Error) {
      throw createHttpError(400, newPost.message);
    } else {
      res.status(201).json({ message: 'Post has been created.' });
    }
  } catch (error) {
    next(error);
  }
};

export const savePost = async (req: Request, res: Response, next: NextFunction) => {
  const { postID } = req.params;
  try {
    if (typeof req.user === 'undefined') {
      throw createHttpError(400, 'This resource requires a logged in user.');
    }
    const result = await SavedPosts.savePost(req.user, postID);
    if (result instanceof Error) {
      throw createHttpError(400, result.message);
    } else {
      res.status(201).json({ message: result.message, savedPost: result.savedPost });
    }
  } catch (error) {
    next(error);
  }
};

export const unSavePost = async (req: Request, res: Response, next: NextFunction) => {
  const { postID } = req.params;
  try {
    if (typeof req.user === 'undefined') {
      throw createHttpError(400, 'This resource requires a logged in user.');
    }
    const result = await SavedPosts.unSavePost(req.user, postID);
    if (result instanceof Error) {
      throw createHttpError(400, result.message);
    } else {
      res.status(200).json({ message: result.message });
    }
  } catch (error) {
    next(error);
  }
};

export const hidePost = async (req: Request, res: Response, next: NextFunction) => {
  const { postID } = req.params;
  try {
    if (typeof req.user === 'undefined') {
      throw createHttpError(400, 'This resource requires a logged in user.');
    }
    const result = await HiddenPosts.hidePost(req.user, postID);
    if (result instanceof Error) {
      throw createHttpError(400, result.message);
    } else {
      res.status(200).json({ message: result.message, hiddenPost: result.hiddenPost });
    }
  } catch (error) {
    next(error);
  }
};

export const unHidePost = async (req: Request, res: Response, next: NextFunction) => {
  const { postID } = req.params;
  try {
    if (typeof req.user === 'undefined') {
      throw createHttpError(400, 'This resource requires a logged in user.');
    }
    const result = await HiddenPosts.unHidePost(req.user, postID);
    if (result instanceof Error) {
      throw createHttpError(400, result.message);
    } else {
      res.status(200).json({ message: result.message });
    }
  } catch (error) {
    next(error);
  }
};

export const getPosts = async (req: Request, res: Response, next: NextFunction) => {
  const page = Number(req.params.page) ?? 1;
  const limit = 10;
  try {
    if (typeof req.user === 'undefined') {
      throw createHttpError(400, 'This resource requires a logged in user.');
    }
    const posts = await Posts.getPosts(req.user, page, limit);
    if (posts instanceof Error) {
      throw createHttpError(400, posts.message);
    } else {
      res.status(200).json({ posts });
    }
  } catch (error) {
    next(error);
  }
};

export const visitPost = async (req: Request, res: Response, next: NextFunction) => {
  const { postID } = req.params;
  try {
    if (typeof req.user === 'undefined') {
      throw createHttpError(400, 'This resource requires a logged in user.');
    }
    const post = await Posts.getPost(postID, req.user);
    if (post instanceof Error) {
      throw createHttpError(400, post.message);
    } else {
      res.status(200).json({ post });
    }
  } catch (error) {
    next(error);
  }
};

export const getYourPosts = async (req: Request, res: Response, next: NextFunction) => {
  const page = Number(req.params.page) ?? 1;
  const limit = 10;
  try {
    if (typeof req.user === 'undefined') {
      throw createHttpError(400, 'This resource requires a logged in user.');
    }
    const posts = await Posts.getYourPosts(req.user, page, limit);
    if (posts instanceof Error) {
      throw createHttpError(400, posts.message);
    } else {
      res.status(200).json({ posts });
    }
  } catch (error) {
    next(error);
  }
};

export const getYourSavedPosts = async (req: Request, res: Response, next: NextFunction) => {
  const page = Number(req.params.page) ?? 1;
  const limit = 10;
  try {
    if (typeof req.user === 'undefined') {
      throw createHttpError(400, 'This resource requires a logged in user.');
    }
    const savedPosts = await SavedPosts.getYourSavedPosts(req.user, page, limit);
    if (savedPosts instanceof Error) {
      throw createHttpError(400, savedPosts.message);
    } else {
      res.status(200).json({ savedPosts });
    }
  } catch (error) {
    next(error);
  }
};

export const getYouHiddenPosts = async (req: Request, res: Response, next: NextFunction) => {
  const page = Number(req.params.page) ?? 1;
  const limit = 10;
  try {
    if (typeof req.user === 'undefined') {
      throw createHttpError(400, 'This resource requires a logged in user.');
    }
    const hiddenPosts = await HiddenPosts.getYourHiddenPosts(req.user, page, limit);
    if (hiddenPosts instanceof Error) {
      throw createHttpError(400, hiddenPosts.message);
    } else {
      res.status(200).json({ hiddenPosts });
    }
  } catch (error) {
    next(error);
  }
};

export const updateUpvotes = async (req: Request, res: Response, next: NextFunction) => {
  const { postID } = req.params;

  try {
    const updateUpvote = await Upvotes.updateUpvotes(postID, req.user);
    if (updateUpvote instanceof Error) {
      throw createHttpError(400, updateUpvote.message);
    } else {
      res.status(200).json({ message: updateUpvote.message });
    }
  } catch (error) {
    next(error);
  }
};

export const updateDownvotes = async (req: Request, res: Response, next: NextFunction) => {
  const { postID } = req.params;
  try {
    const updateDownvote = await Downvotes.updateDownvotes(postID, req.user);
    if (updateDownvote instanceof Error) {
      throw createHttpError(400, updateDownvote.message);
    } else {
      res.status(200).json({ message: updateDownvote.message });
    }
  } catch (error) {
    next(error);
  }
};

export const editPost = async (req: Request, res: Response, next: NextFunction) => {
  const { postID } = req.params;
  const { title, body } = req.body;
  try {
    const post = await Posts.editPost(postID, title, body);
    if (post instanceof Error) {
      throw createHttpError(400, post.message);
    } else {
      res.status(200).json({ message: post.message });
    }
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req: Request, res: Response, next: NextFunction) => {
  const { postID } = req.params;
  try {
    const post = await Posts.deletePost(postID);
    if (post instanceof Error) {
      throw createHttpError(400, post.message);
    } else {
      res.status(200).json({ message: post.message });
    }
  } catch (error) {
    next(error);
  }
};
