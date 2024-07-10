const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // name: String,
    fname: {
      type: String,
      required: true,
    },
    lname: {
      type: String,
      required: true,
    },
    countryCode: {
      type: String,
      required: true,
    },
    mobile: {
      type: Number,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      required: true,
    },
    password: {
      type: String,
    },
    dob: {
      type: String,
      required: true,
    },
    profile: String,
    building: {
      type: String,
      required: true,
    },
    apartment: {
      type: String,
      required: true,
    },
    towner: {
      type: String,
      required: true,
    },
    addNo: {
      type: Number,
      required: true,
    },
    street: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    nation: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin", "superAdmin"],
      default: "user",
    },
    status: { type: String, enum: ["Active", "Disabled"], default: "Active" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
