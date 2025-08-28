import { useState } from "react";
import { api } from "../lib/api";

export const LoginForm: React.FC = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.auth.login(login, password);

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        window.location.href = "/";
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Login failed");
      }
    } catch (error) {
      setError("Network error occurred");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Login</h2>

      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label htmlFor="login">Email or Username:</label>
        <input
          id="login"
          type="text"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          required
          placeholder="Enter your email or username"
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
};
