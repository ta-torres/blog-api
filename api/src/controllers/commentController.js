import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// /api/comments/post/:postId
// show comments for published posts
export const getPostComments = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (!post.published && (!req.user || !req.user.isAuthor)) {
      return res.status(404).json({ error: "Post not found" });
    }

    const comments = await prisma.comment.findMany({
      where: { postId },
      include: {
        author: { select: { id: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch comments" });
  }
};

// /api/comments
// only authenticated users can comment & only published posts can be commented
export const createComment = async (req, res) => {
  try {
    const { content, postId } = req.body;

    if (!content || !postId) {
      return res.status(400).json({ error: "Content and postId are required" });
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (!post.published) {
      return res
        .status(400)
        .json({ error: "Cannot comment on unpublished posts" });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        authorId: req.user.id,
      },
      include: {
        author: { select: { id: true, email: true } },
      },
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: "Failed to create comment" });
  }
};

// /api/comments/:id
// author or comment owner can delete
export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    if (comment.authorId !== req.user.id && !req.user.isAuthor) {
      return res.status(403).json({
        error: "You can only delete your own comments",
      });
    }

    await prisma.comment.delete({ where: { id } });

    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete comment" });
  }
};
