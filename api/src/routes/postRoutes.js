import express from "express";
import postController from "../controllers/postController.js";
import {
  authenticateToken,
  requireAuthor,
  optionalAuth,
} from "../middleware/auth.js";
import {
  validateCreatePost,
  validateUpdatePost,
} from "../middleware/validation.js";

const router = express.Router();

// author before getPublishedPosts
router.get(
  "/all",
  authenticateToken,
  requireAuthor,
  postController.getAllPosts,
);
router.get("/", postController.getPublishedPosts);
router.get("/:id", optionalAuth, postController.getPost);
router.get("/post/:slug", optionalAuth, postController.getPostBySlug);
router.put(
  "/:id",
  validateUpdatePost,
  authenticateToken,
  requireAuthor,
  postController.updatePost,
);
router.put(
  "/:id/publish",
  authenticateToken,
  requireAuthor,
  postController.togglePublishStatus,
);
router.post(
  "/",
  validateCreatePost,
  authenticateToken,
  requireAuthor,
  postController.createPost,
);
router.delete(
  "/:id",
  authenticateToken,
  requireAuthor,
  postController.deletePost,
);

export default router;
