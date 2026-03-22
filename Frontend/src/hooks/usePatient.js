import { useCallback, useEffect } from "react";
import { getPatientData } from "../api/patientApi";
import usePatientStore from "../store/usePatientStore";

const CACHE_TTL_MS = 5 * 60 * 1000;

export default function usePatient() {
  const {
    patient,
    loading,
    error,
    lastFetched,
    setLoading,
    setPatient,
    setError,
  } = usePatientStore();

  const loadPatient = useCallback(
    async ({ force = false } = {}) => {
      const hasFreshCache =
        !force && patient && lastFetched && Date.now() - lastFetched < CACHE_TTL_MS;

      if (hasFreshCache) {
        return patient;
      }

      setLoading(true);

      try {
        const nextPatient = await getPatientData();
        setPatient(nextPatient);
        return nextPatient;
      } catch (err) {
        setError("Unable to load patient data.");
        throw err;
      }
    },
    [lastFetched, patient, setError, setLoading, setPatient]
  );

  useEffect(() => {
    if (!patient && !loading) {
      loadPatient().catch(() => {
        // store already contains the error state
      });
    }
  }, [loadPatient, loading, patient]);

  return {
    patient,
    loading,
    error,
    loadPatient,
    setPatient,
  };
}
