/* eslint-disable linebreak-style */
const mongoose = require("mongoose");

let Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  pdfs: [
    {
      type: Schema.ObjectId,
      ref: "Pdf"
    }
  ],
  photos: [
    {
      type: Schema.ObjectId,
      ref: "Photo"
    }
  ],
  texts: [
    {
      type: Schema.ObjectId,
      ref: "Text"
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

// Virtual for this text URL.
UserSchema.virtual("userURL").get(function() {
  return "/users/" + this._id;
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
