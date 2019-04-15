const mongoose = require("mongoose");

let Schema = mongoose.Schema;

const PhotoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    path: {
      type: String,
      required: true
    },
    discription: {
      type: String
    },
    caption: {
      type: String
    },
    _user: {
      type: Schema.ObjectId,
      ref: "User",
      required: true
    },
    _type: {
      type: Schema.ObjectId,
      ref: "Type",
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Virtual for this document photo instance URL.
PhotoSchema.virtual("docphotoURL").get(function() {
  return "/document/photo/" + this._id;
});

// Virtual for this notice photo instance URL.
PhotoSchema.virtual("notiphotoURL").get(function() {
  return "/notice/photo/" + this._id;
});

module.exports = mongoose.model("Photo", PhotoSchema);