import {
  createPost,
  deletePost,
  editPost,
  getPosts,
  getYouHiddenPosts,
  getYourPosts,
  getYourSavedPosts,
  hidePost,
  savePost,
  unHidePost,
  unSavePost,
  updateDownvotes,
  updateUpvotes,
  visitPost,
} from '@controllers/postControllers';
import { validateData } from '@middlewares/validationMiddleware';
import { verifyUserSession } from '@middlewares/verifyUserSession';
import { postSchema } from '@validation/schemas';
import { Router } from 'express';

const router = Router();

router.get('/posts/:page', verifyUserSession, getPosts);
router.get('/posts/post/:postID', verifyUserSession, visitPost);
router.get('/posts/your-posts/:page', verifyUserSession, getYourPosts);
router.get('/posts/your-saved-posts/:page', verifyUserSession, getYourSavedPosts);
router.get('/posts/your-hidden-posts/:page', verifyUserSession, getYouHiddenPosts);
router.post('/posts/create-post', verifyUserSession, validateData(postSchema), createPost);
router.post('/posts/upvote/:postID', verifyUserSession, updateUpvotes);
router.post('/posts/downvote/:postID', verifyUserSession, updateDownvotes);
router.post('/posts/save-post/:postID', verifyUserSession, savePost);
router.post('/posts/unsave-post/:postID', verifyUserSession, unSavePost);
router.post('/posts/hide-post/:postID', verifyUserSession, hidePost);
router.post('/posts/unhide-post/:postID', verifyUserSession, unHidePost);
router.patch('/posts/edit-post/:postID', verifyUserSession, validateData(postSchema), editPost);
router.delete('/posts/delete-post/:postID', verifyUserSession, deletePost);

export default router;
