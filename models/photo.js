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
PhotoSchema.virtual("url").get(function() {
  return "/photo/" + this._id;
});

module.exports = mongoose.model("Photo", PhotoSchema);