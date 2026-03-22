import { create } from "zustand";
import { persist } from "zustand/middleware";

const usePatientStore = create(
  persist(
    (set) => ({
      patient: null,
      loading: false,
      error: "",
      lastFetched: 0,
      setLoading: (loading) => set({ loading }),
      setPatient: (patient) =>
        set({
          patient,
          error: "",
          loading: false,
          lastFetched: Date.now(),
        }),
      setPatientData: (patient) =>
        set({
          patient,
          error: "",
          loading: false,
          lastFetched: Date.now(),
        }),
      updatePatientData: (patient) =>
        set((state) => ({
          patient: patient ?? state.patient,
          lastFetched: Date.now(),
        })),
      updatePatientField: (field, value) =>
        set((state) => ({
          patient: { ...(state.patient || {}), [field]: value },
          lastFetched: Date.now(),
        })),
      setError: (error) =>
        set({
          error,
          loading: false,
        }),
      clearPatient: () =>
        set({
          patient: null,
          error: "",
          loading: false,
          lastFetched: 0,
        }),
      clearPatientData: () =>
        set({
          patient: null,
          error: "",
          loading: false,
          lastFetched: 0,
        }),
    }),
    {
      name: "medivault_patient_store",
      partialize: (state) => ({
        patient: state.patient,
        lastFetched: state.lastFetched,
      }),
    }
  )
);

export default usePatientStore;
