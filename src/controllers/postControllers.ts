import HiddenPosts from '@models/HiddenPosts';
import Posts from '@models/Posts';
import SavedPosts from '@models/SavedPosts';
import { RequestHandler } from 'express';
import createHttpError from 'http-errors';

export const createPost: RequestHandler = async (req, res, next) => {
  const { title, body } = req.body;
  try {
    const newPost = await Posts.createPost(req.session.passport.user, title, body);
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
    const result = await SavedPosts.savePost(req.session.passport.user, postID);

    if (result instanceof Error) {
      throw createHttpError(400, result.message);
    } else {
      res.status(201).json({ message: result.message });
    }
  } catch (error) {
    next(error);
  }
};

export const unSavePost: RequestHandler = async (req, res, next) => {
  const { postID } = req.params;
  try {
    const result = await SavedPosts.unSavePost(req.session.passport.user, postID);

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
    const result = await HiddenPosts.hidePost(req.session.passport.user, postID);

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
    const result = await HiddenPosts.unHidePost(req.session.passport.user, postID);

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
    const posts = await Posts.getPosts(req.session.passport.user, page, limit);
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
    const posts = await Posts.getYourPosts(req.session.passport.user, page, limit);
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
    const savedPosts = await SavedPosts.getYourSavedPosts(req.session.passport.user, page, limit);
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
    const hiddenPosts = await HiddenPosts.getYourHiddenPosts(req.session.passport.user, page, limit);
    if (hiddenPosts instanceof Error) {
      throw createHttpError(400, hiddenPosts.message);
    } else {
      res.status(200).json({ hiddenPosts });
    }
  } catch (error) {
    next(error);
  }
};
