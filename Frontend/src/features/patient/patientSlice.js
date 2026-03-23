import { createSlice } from "@reduxjs/toolkit";

import { logout } from "../auth/authSlice";
import { fetchPatientProfile, updatePatientProfile } from "./patientThunks";

const initialState = {
  data: null,
  loading: false,
  error: null,
};

const patientSlice = createSlice({
  name: "patient",
  initialState,
  reducers: {
    updatePatientLocal: (state, action) => {
      state.data = state.data
        ? {
            ...state.data,
            ...action.payload,
          }
        : action.payload;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPatientProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatientProfile.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchPatientProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unable to load patient profile.";
      })
      .addCase(updatePatientProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePatientProfile.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(updatePatientProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unable to update patient profile.";
      })
      .addCase(logout, () => ({
        ...initialState,
      }));
  },
});

export const { updatePatientLocal } = patientSlice.actions;

export default patientSlice.reducer;
