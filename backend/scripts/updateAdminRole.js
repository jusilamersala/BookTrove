require('dotenv').config(); 
const mongoose = require("mongoose");
const User = require("../models/UserModel");

const mongoURI = process.env.MONGO_URI;

async function updateAdminRole() {
  try {
    if (!mongoURI) {
      console.error("❌ Error: MONGO_URI is not defined in the .env file!");
      process.exit(1);
    }

    await mongoose.connect(mongoURI);
    console.log("🍃 MongoDB Connected Securely");

    // Update the admin user's role to "admin"
    const result = await User.findOneAndUpdate(
      { email: "admin@booktrove.com" },
      { role: "admin" },
      { new: true }
    );

    if (result) {
      console.log("✅ Admin user updated successfully!");
      console.log(`   User: ${result.username} | Role: ${result.role}`);
    } else {
      console.log("❌ Admin not found. Creating new admin user...");
      
      const newAdmin = await User.create({
        username: "booktroveadmin",
        email: "admin@booktrove.com",
        password: "AdminPassword123", 
        role: "admin"
      });
      
      console.log("✅ New admin user created!");
      console.log(`   Email: ${newAdmin.email} | Role: ${newAdmin.role}`);
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Runtime Error:", error.message);
    process.exit(1);
  }
}

updateAdminRole();