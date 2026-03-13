const mongoose = require("mongoose");
const User = require("./models/UserModel");

const mongoURI = "mongodb+srv://emxhejenxhej_db_user:di2oCFVjeixapuXR@cluster0.c0hfnpq.mongodb.net/BookTrove?retryWrites=true&w=majority";

async function updateAdminRole() {
  try {
    await mongoose.connect(mongoURI);
    console.log("🍃 MongoDB Connected");

    // Update the admin user's role to "admin"
    const result = await User.findOneAndUpdate(
      { email: "admin@booktrove.com" },
      { role: "admin" },
      { new: true }
    );

    if (result) {
      console.log("✅ Admin user updated successfully!");
      console.log("User Details:");
      console.log(`  Username: ${result.username}`);
      console.log(`  Email: ${result.email}`);
      console.log(`  Role: ${result.role}`);
    } else {
      console.log("❌ Admin user not found. Creating new admin user...");
      
      const User = require("./models/UserModel");
      const newAdmin = await User.create({
        username: "booktroveadmin",
        email: "admin@booktrove.com",
        password: "AdminPassword123",
        role: "admin"
      });
      
      console.log("✅ New admin user created!");
      console.log("User Details:");
      console.log(`  Username: ${newAdmin.username}`);
      console.log(`  Email: ${newAdmin.email}`);
      console.log(`  Role: ${newAdmin.role}`);
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

updateAdminRole();
