import HiddenPosts from '@models/HiddenPosts';
import Posts from '@models/Posts';
import SavedPosts from '@models/SavedPosts';
import { RequestHandler } from 'express';
import createHttpError from 'http-errors';

export const createPost: RequestHandler = async (req, res, next) => {
  const { title, body } = req.body;
  try {
    if (typeof req.user === 'undefined') {
      throw createHttpError(400, 'This resource requires a logged in user.');
    }
    const newPost = await Posts.createPost(req.user, title, body);
    if (newPost instanceof Error) {
      throw createHttpError(400, 'Error creating post.');
    } else {
      res.status(201).json({ message: 'Post has been created.' });
    }
  } catch (error) {
    next(error);
  }
};

export const savePost: RequestHandler = async (req, res, next) => {
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

export const unSavePost: RequestHandler = async (req, res, next) => {
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

export const hidePost: RequestHandler = async (req, res, next) => {
  const { postID } = req.params;
  try {
    if (typeof req.user === 'undefined') {
      throw createHttpError(400, 'This resource requires a logged in user.');
    }
    const result = await HiddenPosts.hidePost(req.user, postID);
    if (result instanceof Error) {
      throw createHttpError(400, result.message);
    } else {
      res.status(200).json({ message: result.message });
    }
  } catch (error) {
    next(error);
  }
};

export const unHidePost: RequestHandler = async (req, res, next) => {
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

export const getPosts: RequestHandler = async (req, res, next) => {
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

export const getYourPosts: RequestHandler = async (req, res, next) => {
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

export const getYourSavedPosts: RequestHandler = async (req, res, next) => {
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

export const getYouHiddenPosts: RequestHandler = async (req, res, next) => {
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
