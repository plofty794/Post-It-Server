import {
  createComment,
  getComment,
  showPostComments,
  showYourPostComments,
  updateCommentDownvotes,
  updateCommentUpvotes,
} from '@controllers/commentControllers';
import { validateData } from '@middlewares/validationMiddleware';
import { verifyUserSession } from '@middlewares/verifyUserSession';
import { commentSchema } from '@validation/schemas';
import { Router } from 'express';

const router = Router();

router.get('/comments/:commentID', verifyUserSession, getComment);
router.get('/comments/your-comments/:page', verifyUserSession, showYourPostComments);
router.get('/comments/:postID/:page', verifyUserSession, showPostComments);
router.post('/comments/create-comment/:postID', validateData(commentSchema), verifyUserSession, createComment);
router.post('/comments/upvote/:commentID', verifyUserSession, updateCommentUpvotes);
router.post('/comments/downvote/:commentID', verifyUserSession, updateCommentDownvotes);

export default router;
