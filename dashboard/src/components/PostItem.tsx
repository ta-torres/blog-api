import { useState } from "react";
import { Link } from "react-router";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Eye, Globe, FileText, Calendar, Edit } from "lucide-react";
import type { Post } from "../types";

interface PostItemProps {
  post: Post;
  onTogglePublication: (
    postId: string,
    currentStatus: boolean,
  ) => Promise<boolean>;
}

const PostItem = ({ post, onTogglePublication }: PostItemProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleTogglePublication = async () => {
    setIsLoading(true);
    await onTogglePublication(post.id, post.published);
    setIsLoading(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="max-w-3xl rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow">
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-center">
            <h3 className="truncate text-lg font-semibold text-gray-900">
              {post.title}
            </h3>
          </div>

          <div className="mb-2 flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Modified {formatDate(post.updatedAt)}</span>
            </div>
          </div>

          <p className="mb-4 line-clamp-2 text-sm text-gray-600">
            {post.content.substring(0, 120)}...
          </p>
        </div>

        <div>
          <Badge
            variant={post.published ? "default" : "secondary"}
            className={post.published ? "bg-green-100 text-green-800" : ""}
          >
            {post.published ? (
              <>
                <Globe className="h-3 w-3" />
                Published
              </>
            ) : (
              <>
                <FileText className="h-3 w-3" />
                Draft
              </>
            )}
          </Badge>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 pt-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-gray-600 hover:text-gray-900"
          >
            <Link to={`/dashboard/posts/${post.id}`}>
              <Eye className="mr-1 h-4 w-4" />
              View
            </Link>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-gray-600 hover:text-gray-900"
          >
            <Link to={`/dashboard/edit-post/${post.id}`}>
              <Edit className="mr-1 h-4 w-4" />
              Edit
            </Link>
          </Button>
        </div>

        <div>
          {post.published ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" disabled={isLoading}>
                  Unpublish
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Unpublish Post</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to unpublish "{post.title}"? This will
                    hide the post from your blog readers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleTogglePublication}
                    disabled={isLoading}
                  >
                    {isLoading ? "Unpublishing..." : "Unpublish"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={handleTogglePublication}
              disabled={isLoading}
            >
              {isLoading ? "Publishing..." : "Publish"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostItem;
