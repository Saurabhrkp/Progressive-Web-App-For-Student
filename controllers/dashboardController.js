var Photo = require("../models/photo");
var Pdf = require("../models/pdf");
var Text = require("../models/text");
var Type = require("../models/type");

// Load User model
let User = require("../models/User");

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
        )
          .populate("user")
          .exec(callback);
      },
      pdfs: function(callback) {
        Pdf.find({}, ["path", "caption", "title", "discription", "createdAt"], {
          sort: { _id: -1 }
        })
          .populate("user")
          .exec(callback);
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
        page: "Home Page",
        current: "Dashboard",
        photos: results.photos,
        pdfs: results.pdfs,
        user: req.user.username
      });
    }
  );
};

exports.upload = function(req, res) {
  res.render("upload", { current: "Upload", user: req.user, page: "Upload" });
};

//Account
//Edit
exports.account = function(req, res) {
  res.render("account", {
    current: "Account",
    username: req.user.username,
    page: "Update Account"
  });
};

//Document
//All controls
exports.document = function(req, res) {
  res.render("./uploads/document", {
    current: "Document",
    user: req.user,
    page: "Upload Document"
  });
};

exports.document_photo_get = function(req, res) {
  res.render("./uploads/photo", {
    current: "Document",
    user: req.user._id,
    page: "Upload Documnet"
  });
};

exports.document_photo_post = function(req, res) {
  uploadPhoto(req, res, err => {
    const { title, discription, caption } = req.body;
    const errors = [];
    if (!title || !discription || !caption || req.file == undefined) {
      errors.push({ msg: "Please enter all fields" });
    }
    if (errors.length > 0) {
      res.render("./uploads/photo", {
        errors,
        page: "Please Insert File",
        current: "Upload"
      });
    } else {
      var fullPath = "photos/" + req.file.filename;
      var typeID = "5cb2db77ef58e46ad681be94"; //Document
      const photo = new Photo({
        title,
        path: fullPath,
        discription,
        caption,
        _user: req.user._id,
        _type: typeID
      });
      console.log(photo);
      photo.save(function(err, photo) {
        if (err) return res.send(err);
        User.findById(req.user._id, function(err, user) {
          if (err) return res.send(err);
          user.photos.push(photo._id);
          user.save();
          console.log(user);
        });
        console.log("saved");
        req.flash("success_msg", "You are have Uploaded");
        res.redirect("/dashboard");
      });
      console.log(photo);
    }
  });
};

exports.document_pdf_get = function(req, res) {
  res.render("./uploads/pdf", {
    current: "Document",
    user: req.user,
    page: "Upload Document"
  });
};

exports.document_pdf_post = function(req, res) {
  uploadPdf(req, res, err => {
    const { title, discription, caption } = req.body;
    const errors = [];
    if (!title || !discription || !caption || req.file == undefined) {
      errors.push({ msg: "Please enter all fields" });
    }
    if (errors.length > 0) {
      res.render("./uploads/pdf", {
        errors,
        page: "Please Insert File",
        current: "Upload"
      });
    } else {
      var fullPath = "pdfs/" + req.file.filename;
      var typeID = "5cb2db77ef58e46ad681be94"; //Document
      const pdf = new Pdf({
        title,
        path: fullPath,
        discription,
        caption,
        _user: req.user._id,
        _type: typeID
      });
      console.log(pdf);
      pdf.save(function(err, pdf) {
        if (err) return res.send(err);
        User.findById(req.user._id, function(err, user) {
          if (err) return res.send(err);
          user.pdfs.push(pdf._id);
          user.save();
          console.log(user);
        });
        console.log("saved");
        req.flash("success_msg", "You are have Uploaded");
        res.redirect("/dashboard");
      });
      console.log(pdf);
    }
  });
};

exports.document_post_get = function(req, res) {
  res.render("./uploads/post", {
    current: "Document",
    user: req.user,
    page: "Upload Document"
  });
};

exports.document_post_post = function(req, res) {
  const { title, post, links, tags } = req.body;
  var typeID = "5cb2db77ef58e46ad681be94"; //Document
  const errors = [];
  if (!title || !post) {
    errors.push({ msg: "Please enter Post & Title" });
  }
  if (errors.length > 0) {
    res.render("./uploads/post", {
      errors,
      title,
      post,
      links,
      tags
    });
  } else {
    const text = new Text({
      title,
      post,
      links,
      tags,
      _user: req.user._id,
      _type: typeID
    });
    console.log(text);
    text.save(function(err, text) {
      if (err) return res.send(err);
      User.findById(req.user._id, function(err, user) {
        if (err) return res.send(err);
        user.texts.push(text._id);
        user.save();
        console.log(user);
      });
      console.log("saved");
      req.flash("success_msg", "You are have Uploaded");
      res.redirect("/dashboard");
    });
    console.log(text);
  }
};

//Notice
//All controls  ObjectId("5cb2db55ef58e46ad681be7e")

exports.notice = function(req, res) {
  res.render("./uploads/notice", {
    current: "Document",
    user: req.user,
    page: "Upload Document"
  });
};

exports.notice_photo_get = function(req, res) {
  res.render("./uploads/photo", {
    current: "Document",
    user: req.user._id,
    page: "Upload Document"
  });
};

exports.notice_photo_post = function(req, res) {
  uploadPhoto(req, res, err => {
    var fullPath = "photos/" + req.file.filename;
    const { title, discription, caption } = req.body;
    var typeID = "5cb2db55ef58e46ad681be7e"; //Document
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
      console.log(photo);
      photo.save(function(err, photo) {
        if (err) return res.send(err);
        User.findById(req.user._id, function(err, user) {
          if (err) return res.send(err);
          user.photos.push(photo._id);
          user.save();
          console.log(user);
        });
        console.log("saved");
        req.flash("success_msg", "You are have Uploaded");
        res.redirect("/dashboard");
      });
      console.log(photo);
    }
  });
};

exports.notice_pdf_get = function(req, res) {
  res.render("./uploads/pdf", {
    current: "Document",
    user: req.user,
    page: "Upload Document"
  });
};

exports.notice_pdf_post = function(req, res) {
  uploadPdf(req, res, err => {
    var fullPath = "pdfs/" + req.file.filename;
    const { title, discription, caption } = req.body;
    var typeID = "5cb2db55ef58e46ad681be7e"; //Document
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
      console.log(pdf);
      pdf.save(function(err, pdf) {
        if (err) return res.send(err);
        User.findById(req.user._id, function(err, user) {
          if (err) return res.send(err);
          user.pdfs.push(pdf._id);
          user.save();
          console.log(user);
        });
        console.log("saved");
        req.flash("success_msg", "You are have Uploaded");
        res.redirect("/dashboard");
      });
      console.log(pdf);
    }
  });
};

exports.notice_post_get = function(req, res) {
  res.render("./uploads/post", {
    current: "Document",
    user: req.user,
    page: "Upload Document"
  });
};

exports.notice_post_post = function(req, res) {
  const { title, post, links, tags } = req.body;
  var typeID = "5cb2db55ef58e46ad681be7e"; //Document
  const errors = [];
  if (!title || !post) {
    errors.push({ msg: "Please enter Post & Title" });
  }
  if (errors.length > 0) {
    res.render("./uploads/post", {
      errors,
      title,
      post,
      links,
      tags
    });
  } else {
    const text = new Text({
      title,
      post,
      links,
      tags,
      _user: req.user._id,
      _type: typeID
    });
    console.log(text);
    text.save(function(err, text) {
      if (err) return res.send(err);
      User.findById(req.user._id, function(err, user) {
        if (err) return res.send(err);
        user.texts.push(text._id);
        user.save();
        console.log(user);
      });
      console.log("saved");
      req.flash("success_msg", "You are have Uploaded");
      res.redirect("/dashboard");
    });
    console.log(text);
  }
};
