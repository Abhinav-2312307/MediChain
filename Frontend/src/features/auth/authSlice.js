import { createSlice } from "@reduxjs/toolkit";

import {
  loadUserFromStorage,
  loginWithCredentials,
  loginWithGoogle,
  signupWithCredentials,
} from "./authThunks";
import { getStoredSession } from "./authStorage";

const emptyAuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const initialSession = getStoredSession();

const initialState = {
  ...emptyAuthState,
  ...initialSession,
};

function applyAuthSession(state, session) {
  state.user = session?.user ?? null;
  state.token = session?.token ?? null;
  state.isAuthenticated = Boolean(session?.token);
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      applyAuthSession(state, action.payload);
      state.error = null;
    },
    logout: (state) => {
      Object.assign(state, emptyAuthState);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUserFromStorage.pending, (state) => {
        state.error = null;
      })
      .addCase(loadUserFromStorage.fulfilled, (state, action) => {
        applyAuthSession(state, action.payload);
        state.loading = false;
        state.error = null;
      })
      .addCase(loadUserFromStorage.rejected, (state, action) => {
        Object.assign(state, emptyAuthState);
        state.error = action.payload ?? "Unable to restore your session.";
      })
      .addCase(loginWithCredentials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithCredentials.fulfilled, (state, action) => {
        applyAuthSession(state, action.payload);
        state.loading = false;
        state.error = null;
      })
      .addCase(loginWithCredentials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unable to complete login.";
      })
      .addCase(signupWithCredentials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupWithCredentials.fulfilled, (state, action) => {
        applyAuthSession(state, action.payload);
        state.loading = false;
        state.error = null;
      })
      .addCase(signupWithCredentials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unable to complete signup.";
      })
      .addCase(loginWithGoogle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        applyAuthSession(state, action.payload);
        state.loading = false;
        state.error = null;
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unable to complete Google login.";
      });
  },
});

export const { logout, setCredentials } = authSlice.actions;

export default authSlice.reducer;
