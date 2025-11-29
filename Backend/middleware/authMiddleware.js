const jwt = require("jsonwebtoken");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const Hospital = require("../models/Hospital");

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

async function authMiddleware(req, res, next) {
  try {
    const token = req.cookies?.token; // read token from cookie
    if (!token)
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    const decoded = jwt.verify(token, JWT_SECRET);
    let user;

    if (decoded.role === "patient") user = await Patient.findById(decoded.id);
    else if (decoded.role === "doctor")
      user = await Doctor.findById(decoded.id);
    else if (decoded.role === "hospital")
      user = await Hospital.findById(decoded.id);

    if (!user)
      return res.status(401).json({ message: "Unauthorized: User not found" });
    req.user = {
      id: user._id,
      uid: user.uid,
      name: user.name,
      email: user.email,
      role: decoded.role,
    };

    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
}

module.exports = authMiddleware;
