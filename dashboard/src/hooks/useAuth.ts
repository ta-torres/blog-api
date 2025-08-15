import { useState, useEffect } from "react";
import { api } from "../lib/api";
import type { User } from "../types";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await api.auth.login(email, password);

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        setUser(data.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const verifyToken = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.auth.profile();

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.error("Token verification error:", error);
      localStorage.removeItem("token");
    }
    setLoading(false);
  };

  useEffect(() => {
    verifyToken();
  }, []);

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };
};
