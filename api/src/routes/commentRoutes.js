import express from "express";
import commentController from "../controllers/commentController.js";
import { authenticateToken, optionalAuth } from "../middleware/auth.js";
import { validateCreateComment } from "../middleware/validation.js";

const router = express.Router();

router.get("/post/:postId", optionalAuth, commentController.getPostComments);

router.post(
  "/",
  validateCreateComment,
  authenticateToken,
  commentController.createComment,
);
router.delete("/:id", authenticateToken, commentController.deleteComment);

export default router;
