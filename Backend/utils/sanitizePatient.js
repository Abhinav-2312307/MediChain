function sanitizePatient(patientDoc) {
  if (!patientDoc) {
    return null;
  }

  const patient =
    typeof patientDoc.toObject === "function"
      ? patientDoc.toObject({ virtuals: true })
      : { ...patientDoc };

  if (patient.diagnostics?.vitalSigns) {
    delete patient.diagnostics.vitalSigns;
  }

  return patient;
}

module.exports = {
  sanitizePatient,
};
