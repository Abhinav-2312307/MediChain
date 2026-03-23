import api from "./axios";

export const AUTH_TOKEN_KEY = "token";
export const LEGACY_AUTH_TOKEN_KEY = "medichain_token";

export async function loginWithCredentials(payload) {
  const response = await api.post("/api/auth/login", payload);
  return response.data;
}

export async function signupWithCredentials(payload) {
  const response = await api.post("/api/auth/signup", payload);
  return response.data;
}

export async function loginWithGoogle(payload) {
  const response = await api.post("/api/auth/google", payload);
  return response.data;
}

export function persistAuthSession({ token, user }) {
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(LEGACY_AUTH_TOKEN_KEY, token);
  }

  return user;
}

export function clearAuthSession() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(LEGACY_AUTH_TOKEN_KEY);
}
