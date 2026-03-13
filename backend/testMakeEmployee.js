const mongoose = require('mongoose');
const User = require('./models/UserModel');

const mongoURI = "mongodb+srv://emxhejenxhej_db_user:di2oCFVjeixapuXR@cluster0.c0hfnpq.mongodb.net/BookTrove?retryWrites=true&w=majority";

(async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    const email = 'employee@booktrove.com';
    const user = await User.findOne({ email });
    if (!user) {
      console.error('User not found:', email);
      process.exit(1);
    }

    console.log('Current role:', user.role);
    user.role = 'employee';
    await user.save();
    console.log('Updated role to employee.');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
})();
