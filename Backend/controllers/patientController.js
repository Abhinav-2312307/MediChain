const Patient = require("../models/Patient");

async function getPatientProfile(req, res) {
  try {
    if (req.user.role !== "patient") {
      return res.status(403).json({ message: "Access denied. Patients only." });
    }

    const patient = await Patient.findById(req.user.id).select("-password");

    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }

    return res.status(200).json({ patient });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return res.status(500).json({
      message: "Unable to fetch patient profile.",
      error: error.message,
    });
  }
}

async function updatePatientInfo(req, res) {
  try {
    if (req.user.role !== "patient") {
      return res.status(403).json({ message: "Access denied. Patients only." });
    }

    const {
      bloodGroup,
      address,
      phone,
      emergencyContactName,
      emergencyContactRelation,
      emergencyContactPhone,
    } = req.body;

    const updateFields = {};

    if (bloodGroup) updateFields.bloodGroup = bloodGroup;
    if (address) updateFields.address = address;
    if (phone) updateFields.phone = phone;

    if (emergencyContactName || emergencyContactRelation || emergencyContactPhone) {
      updateFields.emergencyContact = {};

      if (emergencyContactName) {
        updateFields.emergencyContact.name = emergencyContactName;
      }

      if (emergencyContactRelation) {
        updateFields.emergencyContact.relation = emergencyContactRelation;
      }

      if (emergencyContactPhone) {
        updateFields.emergencyContact.phone = emergencyContactPhone;
      }
    }

    if (req.file) {
      updateFields.profilePic = req.file.path;
    }

    const updatedPatient = await Patient.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedPatient) {
      return res.status(404).json({ message: "Patient not found." });
    }

    return res.status(200).json({
      message: "Patient profile updated successfully.",
      patient: updatedPatient,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return res.status(500).json({
      message: "Unable to update patient profile.",
      error: error.message,
    });
  }
}

module.exports = {
  getPatientProfile,
  updatePatientInfo,
};
