import express from "express";
import {
  getPostComments,
  createComment,
  deleteComment,
} from "../controllers/commentController.js";
import { authenticateToken, optionalAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/post/:postId", optionalAuth, getPostComments);

router.post("/", authenticateToken, createComment);
router.delete("/:id", authenticateToken, deleteComment);

export default router;
