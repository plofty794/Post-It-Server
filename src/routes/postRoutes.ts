import {
  createPost,
  getPosts,
  getYouHiddenPosts,
  getYourPosts,
  getYourSavedPosts,
  hidePost,
  savePost,
  unHidePost,
  unSavePost,
} from '@controllers/postControllers';
import { validateData } from '@middlewares/validationMiddleware';
import { verifyUserSession } from '@middlewares/verifyUserSession';
import { postSchema } from '@validation/schemas';
import { Router } from 'express';

const router = Router();

router.get('/posts/:page', verifyUserSession, getPosts);
router.get('/your-posts/:page', verifyUserSession, getYourPosts);
router.get('/your-saved-posts/:page', verifyUserSession, getYourSavedPosts);
router.get('/your-hidden-posts/:page', verifyUserSession, getYouHiddenPosts);
router.post('/create-post', verifyUserSession, validateData(postSchema), createPost);
router.post('/save-post/:postID', verifyUserSession, savePost);
router.post('/unsave-post/:postID', verifyUserSession, unSavePost);
router.post('/hide-post/:postID', verifyUserSession, hidePost);
router.post('/unhide-post/:postID', verifyUserSession, unHidePost);

export default router;
