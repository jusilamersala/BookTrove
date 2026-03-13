const mongoose = require('mongoose');
const User = require('./models/UserModel');

const mongoURI = "mongodb+srv://emxhejenxhej_db_user:di2oCFVjeixapuXR@cluster0.c0hfnpq.mongodb.net/BookTrove?retryWrites=true&w=majority";

(async () => {
  try {
    await mongoose.connect(mongoURI);
    const users = await User.find({}, 'username email role');
    console.log('Users:');
    users.forEach(u => console.log(`- ${u.username} <${u.email}> : ${u.role}`));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
