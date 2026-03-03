const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: [true, "Username është i detyrueshëm"], 
    unique: true,
    trim: true 
  },
  email: { 
    type: String, 
    required: [true, "Email është i detyrueshëm"], 
    unique: true, 
    lowercase: true,
    trim: true 
  },
  password: { 
    type: String, 
    required: [true, "Fjalëkalimi është i detyrueshëm"],
    minlength: 6 
  },
  role: { 
    type: String, 
    enum: ["user", "admin", "employee"], //rolet e mundshme
    default: "user" 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});

// Enkriptimi i fjalëkalimit para ruajtjes
userSchema.pre("save", async function() {
  // NOTE: using async middleware means we don't receive `next` and should
  // simply await operations or throw errors.
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Metodë për të krahasuar fjalëkalimin gjatë Login-it
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);