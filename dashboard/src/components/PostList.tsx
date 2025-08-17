import { usePosts } from "../hooks/usePosts";
import PostItem from "./PostItem";
import { Button } from "./ui/button";
import { Link } from "react-router";
import { PlusCircle, RefreshCw } from "lucide-react";

const PostList = () => {
  const { posts, loading, error, refetch, togglePostPublication } = usePosts();

  if (loading) {
    return (
      <div className="flex max-w-3xl items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Posts</h2>
          <p className="mt-1 text-gray-600">Manage and publish your content</p>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={refetch} variant="ghost" size="sm">
            <div className="animate-spin">
              <RefreshCw className="h-4 w-4" />
            </div>
            <span className="text-sm text-gray-500">Loading posts...</span>
          </Button>

          <Button asChild>
            <Link to="/dashboard/new-post">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Post
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <p>Failed to load posts</p>
        <p>{error}</p>
        <Button onClick={refetch} variant="outline" size="sm">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex max-w-3xl items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Posts</h2>
          <p className="mt-1 text-gray-600">Manage and publish your content</p>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={refetch} variant="ghost" size="sm">
            <RefreshCw className="h-4 w-4" />
          </Button>

          <Button asChild>
            <Link to="/dashboard/new-post">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Post
            </Link>
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <PostItem
            key={post.id}
            post={post}
            onTogglePublication={togglePostPublication}
          />
        ))}
      </div>
    </div>
  );
};

export default PostList;
