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
};
