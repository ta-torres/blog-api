import type {
  CreatePostData,
  UpdatePostData,
  SignupData,
} from "../types/index";

const API_BASE = "http://localhost:8000/api";

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
  "Content-Type": "application/json",
});

export const api = {
  auth: {
    signup: (data: SignupData) =>
      fetch(`${API_BASE}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),

    login: (login: string, password: string) =>
      fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password }),
      }),

    profile: () =>
      fetch(`${API_BASE}/auth/profile`, {
        headers: getAuthHeaders(),
      }),
  },
};
