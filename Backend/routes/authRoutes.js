const express = require("express");
const router = express.Router();
const { signup, login } = require("../controllers/authController");

// Signup route
router.post("/signup", signup);

router.post("/login", login);

// logout route
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Sayonara... さよなら..." });
});

module.exports = router;
