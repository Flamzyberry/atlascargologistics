/**
 * Create the initial administrator securely.
 *
 * Required environment variables in .env.local:
 *   MONGODB_URI, ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD
 *
 * Run locally:
 *   npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/seed-admin.ts
 *
 * No default email or password is stored in source control.
 */
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_NAME = process.env.ADMIN_NAME?.trim();
const ADMIN_EMAIL = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

async function main() {
  if (!MONGODB_URI || !ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error(
      "Set MONGODB_URI, ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD in .env.local before running this script."
    );
  }
  if (ADMIN_PASSWORD.length < 12) {
    throw new Error("ADMIN_PASSWORD must be at least 12 characters long.");
  }
  if (!/^\S+@\S+\.\S+$/.test(ADMIN_EMAIL)) {
    throw new Error("ADMIN_EMAIL must be a valid email address.");
  }

  await mongoose.connect(MONGODB_URI);
  try {
    const UserSchema = new mongoose.Schema(
      {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true, lowercase: true },
        passwordHash: { type: String, required: true },
        role: { type: String, enum: ["ADMIN"], default: "ADMIN", required: true },
      },
      { timestamps: true }
    );
    const User = mongoose.models.User || mongoose.model("User", UserSchema);

    const existing = await User.findOne({ email: ADMIN_EMAIL });
    if (existing) {
      throw new Error("An account with ADMIN_EMAIL already exists. No changes were made.");
    }

    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
    await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      passwordHash,
      role: "ADMIN",
    });
    console.log("Administrator account created. Keep the password private.");
  } finally {
    await mongoose.disconnect();
  }
}

main().catch((error) => {
  console.error("Admin creation failed:", error instanceof Error ? error.message : "Unknown error");
  process.exitCode = 1;
});
