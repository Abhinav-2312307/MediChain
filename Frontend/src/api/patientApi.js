import api from "./axios";

export async function getPatientData() {
  const response = await api.get("/dashboard/patient/data");
  return response.data?.patient || null;
}

export async function updatePatientProfile(payload) {
  const response = await api.put("/patient/update", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data?.patient || null;
}
