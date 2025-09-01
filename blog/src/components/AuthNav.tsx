import { useAuthContext } from "./AuthProvider";

export const AuthNav: React.FC = () => {
  const { user, logout, loading } = useAuthContext();

  if (loading) {
    return <div className="auth-nav" />;
  }

  if (user) {
    return (
      <div className="auth-nav">
        <span>Welcome, {user.displayName || user.username}!</span>
        <button onClick={logout} className="auth-button">
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="auth-nav">
      <a href="/login" className="auth-link">
        Login
      </a>
      <a href="/signup" className="auth-link">
        Sign Up
      </a>
    </div>
  );
};
