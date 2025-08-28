import { useState } from "react";
import { api } from "../lib/api";
import type { SignupData } from "../types";

export const SignupForm: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    displayName: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    const signupData: SignupData = {
      email: formData.email,
      username: formData.username,
      displayName: formData.displayName || undefined,
      password: formData.password,
    };

    try {
      const response = await api.auth.signup(signupData);

      if (response.ok) {
        const result = await response.json();
        localStorage.setItem("token", result.token);
        window.location.href = "/";
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Signup failed");
      }
    } catch (error) {
      setError("Network error occurred");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Sign Up</h2>

      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label htmlFor="username">Username:</label>
        <input
          id="username"
          name="username"
          type="text"
          value={formData.username}
          onChange={handleChange}
          required
          pattern="[a-zA-Z0-9_]+"
          minLength={3}
          title="Username can only contain letters, numbers, and underscores"
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="displayName">Display Name:</label>
        <input
          id="displayName"
          name="displayName"
          type="text"
          value={formData.displayName}
          onChange={handleChange}
          required
          placeholder="Name displayed next to your username"
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
          minLength={6}
        />
      </div>

      <div className="form-group">
        <label htmlFor="confirmPassword">Confirm Password:</label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Creating Account..." : "Sign Up"}
      </button>
    </form>
  );
};
