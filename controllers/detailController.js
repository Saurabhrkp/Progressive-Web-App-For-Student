var Photo = require("../models/photo");
var Pdf = require("../models/pdf");
var Text = require("../models/text");
var Type = require("../models/type");

// Load User model
let User = require("../models/user");

var async = require("async");

// Display detail page for a specific Photo.
exports.photo_detail = function(req, res, next) {
  async.parallel(
    {
      photo: function(callback) {
        Photo.findById(req.params.id)
          .populate("_user")
          .populate("_type")
          .exec(callback);
      }
    },
    function(err, results) {
      if (err) {
        return next(err);
      }
      if (results.photo == null) {
        // No results.
        var err = new Error("Photo not found");
        err.status = 404;
        return next(err);
      }
      // Successful, so render.
      res.render("./details/photo", {
        current: "Photo",
        photo: results.photo,
        user: req.user
      });
    }
  );
};

exports.photo_download = function(req, res, next) {
  async.parallel(
    {
      photo: function(callback) {
        Photo.findById(req.params.id, ["path"]).exec(callback);
      }
    },
    function(err, result) {
      if (err) {
        return next(err);
      }
      if (result.photo == null) {
        // No results.
        var err = new Error("Photo not found");
        err.status = 404;
        return next(err);
      }
      Url = result.photo.path;
      res.download(`./uploads/${Url}`);
    }
  );
};

// Display detail page for a specific Pdf.
exports.pdf_detail = function(req, res, next) {
  async.parallel(
    {
      pdf: function(callback) {
        Pdf.findById(req.params.id)
          .populate("_user")
          .populate("_type")
          .exec(callback);
      }
    },
    function(err, results) {
      if (err) {
        return next(err);
      }
      if (results.pdf == null) {
        // No results.
        var err = new Error("Pdf not found");
        err.status = 404;
        return next(err);
      }
      // Successful, so render.
      res.render("./details/pdf", {
        current: "Pdf",
        pdf: results.pdf,
        user: req.user
      });
    }
  );
};

// Display detail page for a specific Pdf.
exports.post_detail = function(req, res, next) {
  async.parallel(
    {
      post: function(callback) {
        Text.findById(req.params.id)
          .populate("_user")
          .populate("_type")
          .exec(callback);
      }
    },
    function(err, results) {
      if (err) {
        return next(err);
      }
      if (results.post == null) {
        // No results.
        var err = new Error("Pdf not found");
        err.status = 404;
        return next(err);
      }
      // Successful, so render.
      res.render("./details/post", {
        current: "Post",
        post: results.post,
        user: req.user
      });
    }
  );
};