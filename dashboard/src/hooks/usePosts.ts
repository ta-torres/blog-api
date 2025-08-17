import { useState, useEffect } from "react";
import { api } from "../lib/api";
import type { Post } from "../types";

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await api.posts.getAll();

      if (response.ok) {
        const data = await response.json();
        setPosts(data || []);
        setError(null);
      } else {
        setError("Failed to fetch posts");
      }
    } catch (err) {
      setError("Error loading posts");
      console.error("Fetch posts error:", err);
    } finally {
      setLoading(false);
    }
  };

  const togglePostPublication = async (
    postId: string,
    currentStatus: boolean,
  ) => {
    try {
      const response = await api.posts.togglePublish(postId, !currentStatus);

      if (response.ok) {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId ? { ...post, published: !currentStatus } : post,
          ),
        );
        return true;
      } else {
        setError("Failed to update post status");
        return false;
      }
    } catch (err) {
      setError("Error updating post status");
      console.error("Toggle publish error:", err);
      return false;
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return {
    posts,
    loading,
    error,
    refetch: fetchPosts,
    togglePostPublication,
  };
};
