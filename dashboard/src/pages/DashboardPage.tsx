import { Routes, Route } from "react-router";
import Sidebar from "../components/Sidebar";
import PostList from "../components/PostList";
import PostEditor from "../components/PostEditor";

const DashboardPage = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <Routes>
            <Route
              index
              element={
                <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
                  <h2 className="mb-4 text-2xl font-bold text-gray-900">
                    Dashboard
                  </h2>
                  <p className="text-gray-600">
                    I don't know what will go in here yet. Use the sidebar
                  </p>
                </div>
              }
            />
            <Route path="posts" element={<PostList />} />
            <Route
              path="posts/:id"
              element={
                <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
                  <h2 className="mb-4 text-2xl font-bold text-gray-900">
                    Post Preview
                  </h2>
                  <p className="text-gray-600">Post preview</p>
                </div>
              }
            />
            <Route path="new-post" element={<PostEditor />} />
            <Route path="edit-post/:id" element={<PostEditor />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
