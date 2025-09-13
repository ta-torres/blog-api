import type { CreatePostData, UpdatePostData } from "../types/index";

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
  "Content-Type": "application/json",
});

export const api = {
  auth: {
    login: (login: string, password: string) =>
      fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password }),
      }),

    profile: () =>
      fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/profile`, {
        headers: getAuthHeaders(),
      }),
  },

  posts: {
    getAll: () =>
      fetch(`${import.meta.env.VITE_API_BASE_URL}/posts/all`, {
        headers: getAuthHeaders(),
      }),

    getById: (id: string) =>
      fetch(`${import.meta.env.VITE_API_BASE_URL}/posts/${id}`, {
        headers: getAuthHeaders(),
      }),

    togglePublish: (id: string, published: boolean) =>
      fetch(`${import.meta.env.VITE_API_BASE_URL}/posts/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ published }),
      }),

    create: (post: CreatePostData) =>
      fetch(`${import.meta.env.VITE_API_BASE_URL}/posts`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(post),
      }),

    update: (id: string, post: UpdatePostData) =>
      fetch(`${import.meta.env.VITE_API_BASE_URL}/posts/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(post),
      }),
  },
};
