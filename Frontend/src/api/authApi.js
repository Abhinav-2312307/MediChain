import api from "./axios";

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
