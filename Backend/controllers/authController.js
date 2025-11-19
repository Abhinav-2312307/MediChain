const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const Hospital = require("../models/Hospital");

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

const rolePaths = {
  patient: "/patient-portal",
  doctor: "/doctor-dashboard", // For later
  hospital: "/hospital-admin", // For later
};

// to generate UID
const generateUID = async (role, Model) => {
  const prefix = role === "patient" ? "PAT" : role === "doctor" ? "DOC" : "HOS";

  let uid;
  let attempts = 0;
  const maxAttempts = 10;

  while (attempts < maxAttempts) {
    // Use timestamp + random number for better uniqueness
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    uid = `${prefix}-${timestamp}${random}`;

    // Check if UID already exists
    const existing = await Model.findOne({ uid });
    if (!existing) {
      return uid;
    }
    attempts++;
  }

  // Fallback: use timestamp + counter
  const count = await Model.countDocuments();
  return `${prefix}-${Date.now()}-${count + 1}`;
};

// Signup Controller
async function signup(req, res) {
  try {
    const { role, name, email, password, dob, gender } = req.body;

    // Validate role
    if (!role || !["patient", "doctor", "hospital"].includes(role)) {
      return res.status(400).json({
        // message: "Invalid role. Must be patient, doctor, or hospital",
        message: "Bro, choose a real role. This is not Avengers: Endgame.",
      });
    }

    // Validate required fields
    if (!name || !email || !password) {
      return res
        .status(400)
        // .json({ message: "Name, email, and password are required" });
        .json({ message: "Missing details! Even Maggi needs at least 2 ingredients." });
    }

    // Select the correct model based on role
    let Model =
      role === "patient" ? Patient : role === "doctor" ? Doctor : Hospital;

    // Check if user already exists
    const existingUser = await Model.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "This user already exists… just like that one annoying relative." });
    }

    // Generate unique UID
    const uid = await generateUID(role, Model);

    let userData = { name, email, password, uid };

    if (role === "patient" || role === "doctor") {
      if (!dob || !gender) {
        return res.status(400).json({
          message: "DOB & Gender missing — you seem immortal and mysterious.",
        });
      }
      userData = { ...userData, dob, gender };

      if (role === "doctor") {
        const { specialization, licenseNumber } = req.body;
        if (!specialization || !licenseNumber) {
          return res.status(400).json({
            message:
              "Provide your license — we don’t accept Google-certified doctors.",
          });
        }
        userData = { ...userData, specialization, licenseNumber };
      }
    }

    // Create new user with generated UID
    const user = new Model(userData);

    await user.save();
    console.log("User saved successfully:", user.uid);

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role, uid: user.uid },
      process.env.JWT_SECRET || "supersecret",
      { expiresIn: "7d" }
    );

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const redirectTo = rolePaths[role] || "/";

    res.status(201).json({
      message: "User created — welcome to the world of medical chaos.",
      redirectTo,
      user: user,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      message: "Signup error: blame the WiFi, always.",
      error: error.message,
    });
  }
}

// login
async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(401).json({
      message: "Signup error: blame the WiFi, always.",
    });
  }

  try {
    let user =
      (await Patient.findOne({ email })) ||
      (await Doctor.findOne({ email })) ||
      (await Hospital.findOne({ email }));

    if (!user) {
      return res.status(404).json({
        message: "User missing. Maybe you were never born in our database.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password); // input pass and that found user pass
    if (!isMatch) {
      // if pass is wrong, doesnot match
      return res.status(401).json({
        message: "Access denied — who are you? keyboard pranked you?",
      });
    }

    const role = user.constructor.modelName.toLowerCase();

    const token = jwt.sign({ id: user._id, role }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true, // secure from JS access
      secure: process.env.NODE_ENV === "production", // only HTTPS in prod
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Get the correct path for the user's role
    const redirectTo = rolePaths[role] || "/";

    // Send JSON response that your React app can understand
    res.status(200).json({
      message: "Access granted — VIP detected.",
      redirectTo: redirectTo, // tells the frontend where to go
      user: user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      // message:
      //   "Internal Server Error. Please Try Reloading the page or try again after some time",
      message:"Server is crying in a corner. Please retry later.",
    });
  }
}

module.exports = {
  signup,
  login,
};
