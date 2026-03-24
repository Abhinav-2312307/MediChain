const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const Hospital = require("../models/Hospital");
const { sanitizePatient } = require("../utils/sanitizePatient");

// router.get("/patient", authMiddleware, async (req, res) => {
//   try {
//     if (req.user.role !== "patient") {
//       return res.redirect("/auth/login");
//     }

//     // Fetch complete patient data from database
//     const patient = await Patient.findById(req.user.id).select("-password");

//     if (!patient) {
//       return res.redirect("/auth/login");
//     }

//     // Pass all patient data to the view
//     res.render("patientDashboard", {
//       user: patient,
//     });
//   } catch (error) {
//     console.error("Error loading patient dashboard:", error);
//     res.status(500).send("Error loading dashboard");
//   }
// });
router.get("/patient/data", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "patient") {
      return res.status(403).json({ message: "Access denied" });
    }

    const patient = await Patient.findById(req.user.id).select("-password");

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json({ patient: sanitizePatient(patient) });
  } catch (error) {
    console.error("Error fetching patient data:", error);
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/doctor", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "doctor") {
      return res.redirect("/auth/login");
    }

    // Fetch complete doctor data from database
    const doctor = await Doctor.findById(req.user.id).select("-password");

    if (!doctor) {
      return res.redirect("/auth/login");
    }

    // Pass all doctor data to the view
    res.render("doctorDashboard", {
      user: doctor,
    });
  } catch (error) {
    console.error("Error loading doctor dashboard:", error);
    res.status(500).send("Error loading dashboard");
  }
});

router.get("/hospital", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "hospital") {
      return res.redirect("/auth/login");
    }

    // Fetch complete hospital data from database
    const hospital = await Hospital.findById(req.user.id).select("-password");

    if (!hospital) {
      return res.redirect("/auth/login");
    }

    // Pass all hospital data to the view
    res.render("hospitalDashboard", {
      user: {
        id: hospital._id,
        name: hospital.name,
        email: hospital.email,
        uid: hospital.uid,
        address: hospital.address,
        numberOfBeds: hospital.numberOfBeds,
        contactNumber: hospital.contactNumber,
        role: "hospital",
      },
    });
  } catch (error) {
    console.error("Error loading hospital dashboard:", error);
    res.status(500).send("Error loading dashboard");
  }
});

module.exports = router;
