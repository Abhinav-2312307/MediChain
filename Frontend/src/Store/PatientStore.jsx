import { create } from "zustand";
import { persist } from "zustand/middleware";

const usePatientStore = create(
  persist(
    (set) => ({
      patientData: null,
      error: null,

      setPatientData: (data) =>
        set({
          patientData: data,
          error: null,
        }),

      updatePatientData: (data) =>
        set({
          patientData: data,
        }),

      updatePatientField: (field, value) =>
        set((state) => ({
          patientData: { ...state.patientData, [field]: value },
        })),

      setError: (errorMsg) =>
        set({
          error: errorMsg,
        }),

      clearPatientData: () =>
        set({
          patientData: null,
          error: null,
        }),
    }),
    {
      name: "patient_store",
    }
  )
);

export default usePatientStore;