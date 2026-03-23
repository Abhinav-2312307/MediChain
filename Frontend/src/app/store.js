import { configureStore } from "@reduxjs/toolkit";

import authReducer, { logout, setCredentials } from "../features/auth/authSlice";
import {
  loginWithCredentials,
  loginWithGoogle,
  loadUserFromStorage,
  signupWithCredentials,
} from "../features/auth/authThunks";
import { clearAuthSession, persistAuthSession } from "../features/auth/authStorage";
import patientReducer from "../features/patient/patientSlice";

const authPersistenceMiddleware = () => (next) => (action) => {
  const result = next(action);

  if (setCredentials.match(action)) {
    persistAuthSession(action.payload);
  }

  if (logout.match(action)) {
    clearAuthSession();
  }

  const isAuthThunkFulfilled =
    loadUserFromStorage.fulfilled.match(action) ||
    loginWithCredentials.fulfilled.match(action) ||
    signupWithCredentials.fulfilled.match(action) ||
    loginWithGoogle.fulfilled.match(action);

  if (isAuthThunkFulfilled) {
    if (action.payload?.token) {
      persistAuthSession(action.payload);
    } else {
      clearAuthSession();
    }
  }

  return result;
};

const store = configureStore({
  reducer: {
    auth: authReducer,
    patient: patientReducer,
  },
  devTools: import.meta.env.DEV,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // FormData is passed to async thunks when updating profile pictures.
        ignoredActionPaths: ["meta.arg"],
      },
    }).concat(authPersistenceMiddleware),
});

export default store;
