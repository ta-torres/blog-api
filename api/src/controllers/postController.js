import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// /api/posts?page=1&limit=10
const getPublishedPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    /* 
      [posts findMany, totalCount count]
      don't skip any if on page 1
      take limit and calculate total
    */
    const [posts, totalCount] = await Promise.all([
      prisma.post.findMany({
        where: { published: true },
        include: {
          author: { select: { id: true, displayName: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.post.count({
        where: { published: true },
      }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    res.json({
      posts,
      pagination: {
        currentPage: page,
        totalPages,

        totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
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
        author: { select: { id: true, displayName: true } },
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
        author: { select: { id: true, displayName: true } },
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

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// /api/posts
const createPost = async (req, res) => {
  try {
    const { title, content, published = false, excerpt, postImage } = req.body;
    const slug = generateSlug(title);

    const post = await prisma.post.create({
      data: {
        title,
        content,
        excerpt,
        postImage,
        slug,
        published,
        authorId: req.user.id,
      },
      include: {
        author: { select: { id: true, displayName: true } },
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
        author: { select: { id: true, displayName: true } },
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
        author: { select: { id: true, displayName: true } },
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
