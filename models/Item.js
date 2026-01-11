const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },          // Item name (Ex: Phone, Wallet)
  description: { type: String, required: true },   // Details
  contact: { type: String, required: true },       // Phone or Email
  status: { type: String, enum: ["lost", "found"], required: true }, // Lost or Found
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Item", ItemSchema);
