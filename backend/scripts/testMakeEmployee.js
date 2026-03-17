require('dotenv').config({ path: '../.env' }); // Reaches up one level to find the .env file
const mongoose = require('mongoose');
const User = require('../models/UserModel');

const mongoURI = process.env.MONGO_URI;

(async () => {
  try {
    if (!mongoURI) {
      console.error('❌ Error: MONGO_URI is missing from .env');
      process.exit(1);
    }

    await mongoose.connect(mongoURI);
    console.log('🍃 Connected to MongoDB Securely');

    const email = 'employee@booktrove.com';
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    
    if (!user) {
      console.error('❌ User not found:', email);
      console.log('💡 Tip: Make sure the user is registered before running this script.');
      process.exit(1);
    }

    console.log(`👤 User: ${user.username}`);
    console.log(`🔸 Current role: ${user.role}`);
    
    user.role = 'employee';
    await user.save();
    
    console.log('✅ Updated role to: employee');
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
})();