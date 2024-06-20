import Comments from '@models/Comments';
import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';

export const showPostComments = async (req: Request, res: Response, next: NextFunction) => {
  const { postID } = req.params;
  const page = Number(req.params.page) ?? 1;
  const limit = 10;
  try {
    if (typeof req.user === 'undefined') {
      throw createHttpError(400, 'This resource requires a logged in user.');
    }
    const comments = await Comments.getComments(postID, page, limit);
    if (comments instanceof Error) {
      throw createHttpError(400, comments.message);
    } else {
      res.status(200).json({ comments });
    }
  } catch (error) {
    next(error);
  }
};

export const showYourPostComments = async (req: Request, res: Response, next: NextFunction) => {
  const page = Number(req.params.page) ?? 1;
  const limit = 10;
  try {
    if (typeof req.user === 'undefined') {
      throw createHttpError(400, 'This resource requires a logged in user.');
    }
    const yourComments = await Comments.getYourComments(req.user, page, limit);
    if (yourComments instanceof Error) {
      throw createHttpError(400, yourComments.message);
    } else {
      res.status(200).json({ yourComments });
    }
  } catch (error) {
    next(error);
  }
};

export const getComment = async (req: Request, res: Response, next: NextFunction) => {
  const { commentID } = req.params;
  try {
    if (typeof req.user === 'undefined') {
      throw createHttpError(400, 'This resource requires a logged in user.');
    }
    const comment = await Comments.getComment(commentID);
    if (comment instanceof Error) {
      throw createHttpError(400, comment.message);
    } else {
      res.status(200).json({ comment });
    }
  } catch (error) {
    next(error);
  }
};

export const createComment = async (req: Request, res: Response, next: NextFunction) => {
  const { postID } = req.params;
  const { content, commentID } = req.body;
  try {
    if (commentID != null) {
      const comment = await Comments.createComment(postID, content, req.user, commentID);

      if (comment instanceof Error) {
        throw createHttpError(400, comment.message);
      } else {
        res.status(201).json({ comment: comment.message });
      }
    } else {
      const comment = await Comments.createComment(postID, content, req.user);

      if (comment instanceof Error) {
        throw createHttpError(400, comment.message);
      } else {
        res.status(201).json({ comment: comment.message });
      }
    }
  } catch (error) {
    next(error);
  }
};

export const updateCommentUpvotes = async (req: Request, res: Response, next: NextFunction) => {
  const { commentID } = req.params;
  try {
    const result = await Comments.updateCommentUpvotes(commentID, req.user);

    if (result instanceof Error) {
      throw createHttpError(400, result.message);
    } else {
      res.status(200).json({ comment: result.message });
    }
  } catch (error) {
    next(error);
  }
};

export const updateCommentDownvotes = async (req: Request, res: Response, next: NextFunction) => {
  const { commentID } = req.params;
  try {
    const result = await Comments.updateCommentDownvotes(commentID, req.user);

    if (result instanceof Error) {
      throw createHttpError(400, result.message);
    } else {
      res.status(200).json({ comment: result.message });
    }
  } catch (error) {
    next(error);
  }
};

export const editComment = async (req: Request, res: Response, next: NextFunction) => {
  const { commentID } = req.params;
  const { content } = req.body;
  try {
    const editedComment = await Comments.editComment(commentID, content);
    if (editedComment instanceof Error) {
      throw createHttpError(400, editedComment.message);
    } else {
      res.status(200).json({ message: editedComment.message });
    }
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req: Request, res: Response, next: NextFunction) => {
  const { commentID } = req.params;
  try {
    const comment = await Comments.deleteComment(commentID);
    if (comment instanceof Error) {
      throw createHttpError(400, comment.message);
    } else {
      res.status(200).json({ message: comment.message });
    }
  } catch (error) {
    next(error);
  }
};
