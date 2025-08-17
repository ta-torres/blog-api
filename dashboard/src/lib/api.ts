import type { CreatePostData, UpdatePostData } from "../types/index";

const API_BASE = "http://localhost:8000/api";

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
  "Content-Type": "application/json",
});

export const api = {
  auth: {
    login: (email: string, password: string) =>
      fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }),

    profile: () =>
      fetch(`${API_BASE}/auth/profile`, {
        headers: getAuthHeaders(),
      }),
  },

  posts: {
    getAll: () =>
      fetch(`${API_BASE}/posts/all`, {
        headers: getAuthHeaders(),
      }),

    getById: (id: string) =>
      fetch(`${API_BASE}/posts/${id}`, {
        headers: getAuthHeaders(),
      }),

    togglePublish: (id: string, published: boolean) =>
      fetch(`${API_BASE}/posts/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ published }),
      }),

    create: (post: CreatePostData) =>
      fetch(`${API_BASE}/posts`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(post),
      }),

    update: (id: string, post: UpdatePostData) =>
      fetch(`${API_BASE}/posts/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(post),
      }),
  },
};
