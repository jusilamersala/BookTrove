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
    enum: ["user", "admin", "employee", "inventory_manager"], 
    default: "user" 
  },
  // Scheduling for employees (assigned by admin)
  schedule: [
    {
      date: { type: Date, required: true },
      startTime: { type: String, required: true },
      endTime: { type: String, required: true },
      assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      createdAt: { type: Date, default: Date.now }
    }
  ],
  // Attendance records for check-in / check-out
  attendance: [
    {
      date: { type: Date, required: true },
      checkIn: Date,
      checkOut: Date
    }
  ],
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  orari: {
        fillimi: { type: String, default: "08:00" },
        mbarimi: { type: String, default: "16:00" },
        ditet: { type: [String], default: ["Hënë", "Martë", "Mërkurë", "Enjte", "Premte"] }
    }
});

// Encrypt password before saving to database
userSchema.pre("save", async function() {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);