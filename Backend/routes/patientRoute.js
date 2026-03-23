// logic related to patient

const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getPatientProfile,
  updatePatientInfo,
} = require("../controllers/patientController");
const upload = require("../middleware/uploadMiddleware");

router.get("/profile", authMiddleware, getPatientProfile);
router.patch("/profile", authMiddleware, upload.single("profilePic"), updatePatientInfo);

// Legacy endpoint kept during the frontend migration.
router.put("/update", authMiddleware, upload.single("profilePic"), updatePatientInfo);

// Multer error handler for this router
router.use((err, req, res, next) => {
  if (err && err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({ message: "Profile picture too large (max 2MB)." });
  }

  if (err) {
    return res.status(400).json({ message: "Upload failed.", error: err.message });
  }

  return next();
});

module.exports = router;
