const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const Hospital = require("../models/Hospital");

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const IS_PRODUCTION = process.env.NODE_ENV === "production";

const rolePaths = {
  patient: "/patient-portal/dashboard",
  doctor: "/doctor-dashboard",
  hospital: "/hospital-admin",
};

async function generateUID(role, Model) {
  const prefix = role === "patient" ? "PAT" : role === "doctor" ? "DOC" : "HOS";

  let attempts = 0;
  while (attempts < 10) {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    const uid = `${prefix}-${timestamp}${random}`;
    const existing = await Model.findOne({ uid });

    if (!existing) {
      return uid;
    }

    attempts += 1;
  }

  const count = await Model.countDocuments();
  return `${prefix}-${Date.now()}-${count + 1}`;
}

function normalizeEmail(email) {
  return typeof email === "string" ? email.trim().toLowerCase() : "";
}

function sanitizeUser(user) {
  const plainUser = user.toObject ? user.toObject() : { ...user };
  delete plainUser.password;
  return plainUser;
}

function signAuthToken(user, role) {
  return jwt.sign({ id: user._id, role, uid: user.uid }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

function attachAuthCookie(res, token) {
  res.cookie("token", token, {
    httpOnly: true,
    secure: IS_PRODUCTION,
    sameSite: IS_PRODUCTION ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

function sendAuthResponse(res, { user, role, message, statusCode = 200 }) {
  const token = signAuthToken(user, role);
  attachAuthCookie(res, token);

  return res.status(statusCode).json({
    message,
    redirectTo: rolePaths[role] || "/",
    token,
    user: sanitizeUser(user),
  });
}

function getRoleModel(role) {
  if (role === "patient") return Patient;
  if (role === "doctor") return Doctor;
  if (role === "hospital") return Hospital;
  return null;
}

function extractGooglePayload(body) {
  const payload = {
    firebaseToken:
      typeof body.firebaseToken === "string" ? body.firebaseToken.trim() : "",
    uid: typeof body.uid === "string" ? body.uid.trim() : "",
    name: typeof body.name === "string" ? body.name.trim() : "",
    email: normalizeEmail(body.email),
    photoURL: typeof body.photoURL === "string" ? body.photoURL.trim() : "",
  };

  if (!payload.uid || !payload.email) {
    const error = new Error("Google account details are required.");
    error.statusCode = 400;
    throw error;
  }

  return payload;
}

async function googleAuth(req, res) {
  try {
    const payload = extractGooglePayload(req.body);

    // Keep the Firebase token in the request contract so backend verification
    // can be added later without changing the frontend flow.
    void payload.firebaseToken;

    let patient = await Patient.findOne({
      $or: [
        { email: payload.email },
        { "authProviders.google.firebaseUid": payload.uid },
      ],
    });

    if (!patient) {
      patient = await Patient.create({
        uid: await generateUID("patient", Patient),
        name: payload.name || payload.email.split("@")[0] || "Patient",
        email: payload.email,
        profilePic: payload.photoURL,
        authProviders: {
          google: {
            firebaseUid: payload.uid,
            linkedAt: new Date(),
          },
        },
      });
    } else {
      patient.name = patient.name || payload.name;
      patient.email = patient.email || payload.email;
      patient.profilePic = patient.profilePic || payload.photoURL;
      patient.authProviders = {
        ...patient.authProviders,
        google: {
          firebaseUid: payload.uid,
          linkedAt: patient.authProviders?.google?.linkedAt || new Date(),
        },
      };
      await patient.save();
    }

    return sendAuthResponse(res, {
      user: patient,
      role: "patient",
      message: "Google login successful.",
    });
  } catch (error) {
    console.error("Google auth error:", error);
    return res.status(error.statusCode || 500).json({
      message: error.statusCode ? error.message : "Unable to complete Google login.",
    });
  }
}

async function signup(req, res) {
  try {
    const { role, name, email, password, dob, gender } = req.body;

    if (!role || !["patient", "doctor", "hospital"].includes(role)) {
      return res.status(400).json({ message: "Invalid role." });
    }

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required.",
      });
    }

    const normalizedEmail = normalizeEmail(email);
    const Model = getRoleModel(role);
    const existingUser = await Model.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists." });
    }

    let userData = {
      uid: await generateUID(role, Model),
      name: name.trim(),
      email: normalizedEmail,
      password,
    };

    if (role === "patient" || role === "doctor") {
      if (!dob || !gender) {
        return res.status(400).json({ message: "DOB and gender are required." });
      }

      userData = { ...userData, dob, gender };

      if (role === "doctor") {
        const { specialization, licenseNumber } = req.body;

        if (!specialization || !licenseNumber) {
          return res.status(400).json({
            message: "Specialization and license number are required.",
          });
        }

        userData = {
          ...userData,
          specialization,
          licenseNumber,
        };
      }
    }

    const user = await Model.create(userData);

    return sendAuthResponse(res, {
      user,
      role,
      statusCode: 201,
      message: "User created successfully.",
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Unable to complete signup." });
  }
}

async function login(req, res) {
  const normalizedEmail = normalizeEmail(req.body.email);
  const password = req.body.password;

  if (!normalizedEmail || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    const user =
      (await Patient.findOne({ email: normalizedEmail })) ||
      (await Doctor.findOne({ email: normalizedEmail })) ||
      (await Hospital.findOne({ email: normalizedEmail }));

    if (!user || !user.password) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const role = user.constructor.modelName.toLowerCase();

    return sendAuthResponse(res, {
      user,
      role,
      message: "Login successful.",
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Unable to complete login." });
  }
}

module.exports = {
  googleAuth,
  signup,
  login,
};
