import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import MDEditor from "@uiw/react-md-editor";
import { api } from "../lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, Eye } from "lucide-react";
import type { CreatePostData, UpdatePostData } from "../types";
// @ts-expect-error not typed yet
import UploadWidget from "./UploadWidget";

const PostEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEditMode && id) {
      fetchPost(id);
    }
  }, [id, isEditMode]);

  const fetchPost = async (postId: string) => {
    try {
      setLoading(true);
      const response = await api.posts.getById(postId);

      if (response.ok) {
        const data = await response.json();
        setTitle(data.title);
        setContent(data.content);
        setError(null);
      } else {
        setError("Failed to load post");
      }
    } catch (err) {
      setError("Error loading post");
      console.error("Fetch post error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (publish: boolean = false) => {
    if (!title.trim()) {
      setError("Please enter a title");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const postData = {
        title: title.trim(),
        content: content || "",
        published: publish,
      };

      const response = isEditMode
        ? await api.posts.update(id!, postData as UpdatePostData)
        : await api.posts.create(postData as CreatePostData);

      if (response.ok) {
        //const data = await response.json();
        navigate(`/dashboard/posts/`);
      } else {
        setError("Failed to save post");
      }
    } catch (err) {
      setError("Error saving post");
      console.error("Save post error:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard/posts")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Posts
          </Button>
          <span className="text-sm text-gray-500">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard/posts")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Posts
          </Button>
          <h2 className="text-2xl font-bold text-gray-900">
            {isEditMode ? "Edit Post" : "New Post"}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => handleSave(false)}
            disabled={saving}
          >
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Saving..." : "Save Draft"}
          </Button>

          <Button onClick={() => handleSave(true)} disabled={saving}>
            <Eye className="mr-2 h-4 w-4" />
            {saving ? "Publishing..." : "Save & Publish"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-lg border border-gray-200 bg-white p-8">
        <UploadWidget />
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              type="text"
              placeholder="Enter post title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-xl font-semibold"
            />
          </div>

          <div className="space-y-2">
            <Label>Content</Label>
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <MDEditor
                value={content}
                onChange={(val) => setContent(val || "")}
                height={700}
                preview="live"
                hideToolbar={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostEditor;
