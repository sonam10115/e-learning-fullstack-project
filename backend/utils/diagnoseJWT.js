#!/usr/bin/env node

/**
 * JWT & Environment Diagnostic Script
 * Run this to debug JWT_SECRET and token issues
 */

require("dotenv").config();

const jwt = require("jsonwebtoken");
const { ENV } = require("../lib/env.js");

async function runDiagnostics() {
  console.log("\n🔍 === JWT & ENVIRONMENT DIAGNOSTICS ===\n");

  // Check 1: JWT_SECRET
  console.log("📋 Check 1: JWT_SECRET Configuration");
  console.log("-------------------------------------");

  const jwtSecret = process.env.JWT_SECRET;
  const envJwtSecret = ENV.JWT_SECRET;

  console.log("process.env.JWT_SECRET:", jwtSecret ? `✅ Set to "${jwtSecret.substring(0, 20)}..."` : "❌ NOT SET");
  console.log("ENV.JWT_SECRET:", envJwtSecret ? `✅ Set to "${envJwtSecret.substring(0, 20)}..."` : "❌ NOT SET");
  console.log("Length:", envJwtSecret ? envJwtSecret.length + " chars" : "N/A");

  if (!envJwtSecret) {
    console.error("\n❌ CRITICAL: JWT_SECRET is not configured!");
    console.error("Solution: Set JWT_SECRET in your .env file");
    console.error("Example: JWT_SECRET=your-super-secret-key-here\n");
    return;
  }

  // Check 2: Token Generation
  console.log("\n📋 Check 2: Token Generation & Verification");
  console.log("-------------------------------------");

  try {
    const testPayload = {
      _id: "507f1f77bcf86cd799439011",
      userName: "TestUser",
      userEmail: "test@example.com",
      role: "instructor",
    };

    // Generate a test token
    const testToken = jwt.sign(testPayload, ENV.JWT_SECRET, { expiresIn: "7d" });
    console.log("✅ Test token generated successfully");
    console.log("Token preview:", testToken.substring(0, 50) + "...");

    // Try to verify it
    const decoded = jwt.verify(testToken, ENV.JWT_SECRET);
    console.log("✅ Test token verified successfully");
    console.log("Decoded payload:", decoded);

  } catch (error) {
    console.error("❌ Token generation/verification failed:", error.message);
  }

  // Check 3: .env file
  console.log("\n📋 Check 3: .env File Contents (Checking for JWT_SECRET)");
  console.log("-------------------------------------");

  const fs = require("fs");
  const path = require("path");
  const envPath = path.join(__dirname, "../.env");

  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf-8");
    const hasJwtSecret = envContent.includes("JWT_SECRET");

    if (hasJwtSecret) {
      console.log("✅ JWT_SECRET line found in .env");
      const jwtLine = envContent.split("\n").find(line => line.startsWith("JWT_SECRET"));
      console.log("Line:", jwtLine ? jwtLine.substring(0, 50) + "..." : "not found");
    } else {
      console.error("❌ JWT_SECRET not found in .env file");
    }
  } else {
    console.error("❌ .env file not found at:", envPath);
  }

  // Check 4: Database Connection  
  console.log("\n📋 Check 4: Database & User Models");
  console.log("-------------------------------------");

  try {
    const User = require("../models/User.js");
    const userCount = await User.countDocuments();
    console.log(`✅ Database connected - ${userCount} users in DB`);
  } catch (error) {
    console.error("❌ Database error:", error.message);
  }

  // Check 5: Consistency check
  console.log("\n📋 Check 5: JWT_SECRET Consistency");
  console.log("-------------------------------------");

  const secretsMatch = process.env.JWT_SECRET === ENV.JWT_SECRET;

  if (secretsMatch) {
    console.log("✅ process.env.JWT_SECRET === ENV.JWT_SECRET");
  } else {
    console.error("❌ JWT_SECRET mismatch!");
    console.error("   process.env.JWT_SECRET:", process.env.JWT_SECRET ? "set" : "not set");
    console.error("   ENV.JWT_SECRET:", ENV.JWT_SECRET ? "set" : "not set");
  }

  // Summary
  console.log("\n📊 SUMMARY");
  console.log("-------------------------------------");

  const checks = [
    ["JWT_SECRET configured", !!ENV.JWT_SECRET],
    ["JWT Secret matches between env sources", process.env.JWT_SECRET === ENV.JWT_SECRET],
    ["Secrets are non-empty", ENV.JWT_SECRET && ENV.JWT_SECRET.length > 0],
  ];

  let allPass = true;
  checks.forEach(([check, pass]) => {
    console.log(`${pass ? "✅" : "❌"} ${check}`);
    if (!pass) allPass = false;
  });

  if (allPass) {
    console.log("\n✅ All checks passed! Socket auth should work.");
    console.log("\nIf socket still fails, check:");
    console.log("1. Backend WAS RESTARTED after seeing this output");
    console.log("2. Clear localStorage and login with a NEW token");
    console.log("3. The token was created with THIS JWT_SECRET value");
  } else {
    console.log("\n❌ Some checks failed. Fix issues above and restart server.");
  }

  console.log("\n📝 NEXT STEPS:");
  console.log("1. If outputs above show ✅ all pass:");
  console.log("   npm start");
  console.log("2. Clear browser storage:");
  console.log("   localStorage.clear(); sessionStorage.clear(); location.reload();");
  console.log("3. Login again - token will be created with current JWT_SECRET");
  console.log("4. Socket should connect without 'invalid signature' error\n");
}

// Run the diagnostics
runDiagnostics().catch(error => {
  console.error("Diagnostics error:", error);
  process.exit(1);
});
