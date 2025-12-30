const mongoose = require("mongoose");

// define schema
const categorySchema = new mongoose.Schema({
  categoryname: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  image: {
    public_id: String,
    url: String
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  }
}, { timestamps: true });

module.exports = mongoose.model("category", categorySchema);