const mongoose = require("mongoose");

let Schema = mongoose.Schema;

const TextSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    post: {
      type: String,
      required: true
    },
    links: {
      type: String
    },
    tags: {
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

// Virtual for this text URL.
TextSchema.virtual("url").get(function() {
  return "/text/" + this._id;
});

module.exports = mongoose.model("Text", TextSchema);
