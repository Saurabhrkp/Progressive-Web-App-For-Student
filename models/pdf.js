const mongoose = require("mongoose");

let Schema = mongoose.Schema;

const PdfSchema = new mongoose.Schema(
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

// Virtual for this PDF instance URL.
PdfSchema.virtual("docpdfURL").get(function() {
  return "/dashboard/pdf/" + this._id;
});

// Virtual for this PDF instance URL.
PdfSchema.virtual("notipdfURL").get(function() {
  return "/dashboard/pdf/" + this._id;
});

module.exports = mongoose.model("Pdf", PdfSchema);