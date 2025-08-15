import { Link, useLocation } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { Button } from "./ui/button";
import { Home, FileText, PlusCircle, LogOut, User } from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const navigation = [
    {
      name: "Overview",
      href: "/dashboard",
      icon: Home,
    },
    {
      name: "Posts",
      href: "/dashboard/posts",
      icon: FileText,
    },
    {
      name: "New Post",
      href: "/dashboard/new-post",
      icon: PlusCircle,
    },
  ];

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="flex h-screen w-64 flex-col border-r border-gray-200 bg-white">
      <div className="border-b border-gray-200 p-6">
        <h1 className="text-xl font-semibold text-gray-900">Blog Dashboard</h1>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={`flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? "border-r-2 border-blue-700 bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  } `}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-gray-200 p-4">
        <div className="mb-3 flex items-center space-x-3">
          <div className="rounded-full bg-gray-100 p-2">
            <User className="h-4 w-4 text-gray-600" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-gray-900">
              {user?.email}
            </p>
            <p className="text-xs text-gray-500">Author</p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className="w-full justify-start text-gray-600 hover:text-gray-900"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
