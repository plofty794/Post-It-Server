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
