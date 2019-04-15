var Photo = require("../models/photo");
var Pdf = require("../models/pdf");
var Text = require("../models/text");
var Type = require("../models/type");

//Using Multer
var uploadPhoto = require("../uploads/multerPhoto");
var uploadPdf = require("../uploads/multerPdf");

var async = require("async");

// Display Author delete form on GET.
exports.dashboard = function(req, res, next) {
  async.parallel(
    {
      photos: function(callback) {
        Photo.find(
          {},
          ["path", "caption", "title", "discription", "createdAt"],
          { sort: { _id: -1 } }
        ).exec(callback);
      },
      pdfs: function(callback) {
        Pdf.find({}, ["path", "caption", "title", "discription", "createdAt"], {
          sort: { _id: -1 }
        }).exec(callback);
      }
    },
    function(err, results) {
      if (err) {
        return next(err);
      }
      if (results.photos == null) {
        // No results.
        res.redirect("dashboard");
      }
      // Successful, so render.
      res.render("dashboard", {
        page_name: "Dashboard",
        photos: results.photos,
        pdfs: results.pdfs,
        user: req.user.username
      });
    }
  );
};

exports.upload = function(req, res) {
  res.render("upload", { page_name: "Upload", user: req.user });
};

//Account
//Edit
exports.account = function(req, res) {
  res.render("account", { page_name: "Account", username: req.user.username });
};

//Document
//All controls
exports.document = function(req, res) {
  res.render("./uploads/document", { page_name: "Document", user: req.user });
};

exports.document_photo_get = function(req, res) {
  res.render("./uploads/photo", { page_name: "Document", user: req.user._id });
};

exports.document_photo_post = function(req, res) {
  uploadPhoto(req, res, err => {
    var fullPath = "photos/" + req.file.filename;
    const { title, discription, caption } = req.body;
    var typeID = "5cb2db77ef58e46ad681be94"; //Document
    const errors = [];
    if (!title || !discription || !caption) {
      errors.push({ msg: "Please enter all fields" });
    }
    if (errors.length > 0) {
      res.render("./uploads/photo", {
        errors,
        title,
        discription,
        caption
      });
    } else {
      const photo = new Photo({
        title,
        path: fullPath,
        discription,
        caption,
        _user: req.user._id,
        _type: typeID
      });
      photo.save().then(photo => {
        req.flash("success_msg", "You are have Uploaded");
        res.redirect("/dashboard");
      });
    }
  });
};

exports.document_pdf_get = function(req, res) {
  res.render("./uploads/pdf", { page_name: "Document", user: req.user });
};

exports.document_pdf_post = function(req, res) {
  uploadPdf(req, res, err => {
    var fullPath = "pdfs/" + req.file.filename;
    const { title, discription, caption } = req.body;
    var typeID = "5cb2db77ef58e46ad681be94"; //Document
    const errors = [];
    if (!title || !discription || !caption) {
      errors.push({ msg: "Please enter all fields" });
    }
    if (errors.length > 0) {
      res.render("./uploads/pdf", {
        errors,
        title,
        discription,
        caption
      });
    } else {
      const pdf = new Pdf({
        title,
        path: fullPath,
        discription,
        caption,
        _user: req.user._id,
        _type: typeID
      });
      pdf.save().then(pdf => {
        req.flash("success_msg", "You are have Uploaded a PDF");
        res.redirect("/dashboard");
      });
    }
  });
};

exports.document_post = function(req, res) {
  res.render("./uploads/post", { page_name: "Document", user: req.user });
};

//Notice
//All controls  ObjectId("5cb2db55ef58e46ad681be7e")
exports.notice = function(req, res) {
  res.render("./uploads/notice", { page_name: "Notice", user: req.user });
};

exports.notice_photo = function(req, res) {
  res.render("./uploads/photo", { page_name: "Notice", user: req.user });
};

exports.notice_pdf = function(req, res) {
  res.render("./uploads/pdf", { page_name: "Notice", user: req.user });
};

exports.notice_post = function(req, res) {
  res.render("./uploads/post", { page_name: "Notice", user: req.user });
};
