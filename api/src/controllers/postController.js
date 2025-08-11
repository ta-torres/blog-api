import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// /api/posts
const getPublishedPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      include: {
        author: { select: { id: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};

// /api/posts/all
// include unpublished
const getAllPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: { select: { id: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};

// /api/posts/:id
// only authors can see their own unpublished posts
const getPost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, email: true } },
      },
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (!post.published && (!req.user || !req.user.isAuthor)) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch post" });
  }
};

// /api/posts
const createPost = async (req, res) => {
  try {
    const { title, content, published = false } = req.body;

    const post = await prisma.post.create({
      data: {
        title,
        content,
        published,
        authorId: req.user.id,
      },
      include: {
        author: { select: { id: true, email: true } },
      },
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: "Failed to create post" });
  }
};

// /api/posts/:id/publish
const togglePublishStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const existingPost = await prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (existingPost.authorId !== req.user.id) {
      return res.status(403).json({
        error: "You can only modify your own posts",
      });
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: { published: !existingPost.published },
      include: {
        author: { select: { id: true, email: true } },
      },
    });

    res.json({
      message: `Post ${updatedPost.published ? "published" : "unpublished"} successfully`,
      post: updatedPost,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to update post status" });
  }
};

// /api/posts/:id
const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, published } = req.body;

    const existingPost = await prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (existingPost.authorId !== req.user.id) {
      return res.status(403).json({
        error: "You can only update your own posts",
      });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (published !== undefined) updateData.published = published;

    const updatedPost = await prisma.post.update({
      where: { id },
      data: updateData,
      include: {
        author: { select: { id: true, email: true } },
      },
    });

    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: "Failed to update post" });
  }
};

// /api/posts/:id
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const existingPost = await prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (existingPost.authorId !== req.user.id) {
      return res
        .status(403)
        .json({ error: "You can only delete your own posts" });
    }

    await prisma.post.delete({ where: { id } });

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete post" });
  }
};

const postController = {
  getPost,
  getPublishedPosts,
  getAllPosts,
  getPost,
  createPost,
  updatePost,
  togglePublishStatus,
  deletePost,
};

export default postController;
