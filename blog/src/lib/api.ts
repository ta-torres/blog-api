import type {
  CreatePostData,
  UpdatePostData,
  SignupData,
} from "../types/index";

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
  "Content-Type": "application/json",
});

export const api = {
  auth: {
    signup: (data: SignupData) =>
      fetch(`${import.meta.env.PUBLIC_API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),

    login: (login: string, password: string) =>
      fetch(`${import.meta.env.PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password }),
      }),

    profile: () =>
      fetch(`${import.meta.env.PUBLIC_API_URL}/auth/profile`, {
        headers: getAuthHeaders(),
      }),
  },
};
