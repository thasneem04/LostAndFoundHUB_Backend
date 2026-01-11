// models/User.js  already i have this 
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileImage: { type: String, default: "" },
  notificationsEnabled: { type: Boolean, default: true },
  isPrivate: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", UserSchema);
