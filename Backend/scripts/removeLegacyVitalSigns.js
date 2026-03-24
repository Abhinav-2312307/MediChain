const path = require("path");
const mongoose = require("mongoose");

require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const { connectToMongoDB } = require("../config/connect");
const Patient = require("../models/Patient");

async function main() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not configured.");
  }

  await connectToMongoDB(process.env.MONGO_URI);

  const result = await Patient.updateMany(
    { "diagnostics.vitalSigns": { $exists: true } },
    { $unset: { "diagnostics.vitalSigns": "" } }
  );

  console.log(
    `Removed legacy vital signs from ${result.modifiedCount} patient record(s).`
  );
}

main()
  .catch((error) => {
    console.error("Failed to remove legacy vital signs:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
