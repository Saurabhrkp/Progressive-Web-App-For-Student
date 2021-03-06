var Photo = require('../models/photo');
var Pdf = require('../models/pdf');
var Text = require('../models/text');
var Type = require('../models/type');

// Load User model
let User = require('../models/user');

//Using Multer
var { uploadPhoto, uploadPDF } = require('./helper');

var async = require('async');

// Display Author delete form on GET.
exports.dashboard = function (req, res, next) {
  async.parallel(
    {
      photos: function (callback) {
        Photo.find(
          {},
          ['path', 'caption', 'title', 'discription', 'createdAt'],
          { sort: { _id: -1 } }
        )
          .populate('_user')
          .populate('_type')
          .exec(callback);
      },
      pdfs: function (callback) {
        Pdf.find({}, ['path', 'caption', 'title', 'discription', 'createdAt'], {
          sort: { _id: -1 },
        })
          .populate('_user')
          .populate('_type')
          .exec(callback);
      },
      posts: function (callback) {
        Text.find({}, ['title', 'post', 'links', 'tags'], {
          sort: { _id: -1 },
        })
          .populate('_user')
          .populate('_type')
          .exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.photos == null) {
        // No results.
        res.redirect('dashboard');
      }
      // Successful, so render.
      res.render('dashboard', {
        current: 'Dashboard',
        photos: results.photos,
        pdfs: results.pdfs,
        posts: results.posts,
        user: req.user,
      });
    }
  );
};

exports.upload = function (req, res) {
  res.render('upload', { current: 'Upload', user: req.user });
};

//Account
//Edit
exports.account = function (req, res) {
  const userID = req.user._id;
  async.parallel(
    {
      list: function (callback) {
        User.findById(userID, 'photos pdfs texts')
          .populate('photos')
          .populate('pdfs')
          .populate('texts')
          .exec(callback);
      },
      // photos: function(callback) {
      //   Photos.find({ _user: userID }).count().exec(callback);
      // }
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.list == null) {
        // No results.
        res.redirect('dashboard');
      }
      // Successful, so render.
      res.render('account', {
        current: 'account',
        user: req.user,
        list: results.list,
        // photo: req.user.photos
        // pdf: req.user.pdfs,
        // text: req.user.texts
      });
    }
  );
};

//Document
//All controls
exports.document = function (req, res) {
  res.render('./uploads/document', {
    current: 'Upload',
    user: req.user,
  });
};

exports.document_photo_get = function (req, res) {
  res.render('./uploads/photo', {
    current: 'Upload',
    user: req.user._id,
  });
};

exports.document_photo_post = function (req, res) {
  uploadPhoto(req, res, (err) => {
    const { title, discription, caption } = req.body;
    const errors = [];
    if (!title || !discription || !caption || req.file == undefined) {
      errors.push({ msg: 'Please enter all fields' });
    }
    if (errors.length > 0) {
      res.render('./uploads/photo', {
        errors,
        title,
        discription,
        caption,
        current: 'Upload',
      });
    } else {
      var fullPath = 'photos/' + req.file.filename;
      var typeID = '5cb2db77ef58e46ad681be94'; //Document
      const photo = new Photo({
        title,
        path: fullPath,
        discription,
        caption,
        _user: req.user._id,
        _type: typeID,
      });
      photo.save(function (err, photo) {
        if (err) return res.send(err);
        User.findById(req.user._id, function (err, user) {
          if (err) return res.send(err);
          user.photos.push(photo._id);
          user.save();
          console.log({ photo, user });
        });
        Type.findById('5cb2db77ef58e46ad681be94', function (err, type) {
          if (err) return res.send(err);
          type.photos.push(photo._id);
          type.save();
          console.log({ type });
        });
        console.log('saved');
        req.flash('success_msg', 'You are have Uploaded');
        res.redirect('/dashboard');
      });
    }
  });
};

exports.document_pdf_get = function (req, res) {
  res.render('./uploads/pdf', {
    current: 'Upload',
    user: req.user,
  });
};

exports.document_pdf_post = function (req, res) {
  uploadPDF(req, res, (err) => {
    const { title, discription, caption } = req.body;
    const errors = [];
    if (!title || !discription || !caption || req.file == undefined) {
      errors.push({ msg: 'Please enter all fields' });
    }
    if (errors.length > 0) {
      res.render('./uploads/pdf', {
        errors,
        title,
        discription,
        caption,
        current: 'Upload',
      });
    } else {
      var fullPath = 'pdfs/' + req.file.filename;
      var typeID = '5cb2db77ef58e46ad681be94'; //Document
      const pdf = new Pdf({
        title,
        path: fullPath,
        discription,
        caption,
        _user: req.user._id,
        _type: typeID,
      });
      pdf.save(function (err, pdf) {
        if (err) return res.send(err);
        User.findById(req.user._id, function (err, user) {
          if (err) return res.send(err);
          user.pdfs.push(pdf._id);
          user.save();
          console.log({ pdf, user });
        });
        Type.findById('5cb2db77ef58e46ad681be94', function (err, type) {
          if (err) return res.send(err);
          type.pdfs.push(pdf._id);
          type.save();
          console.log({ type });
        });
        console.log('saved');
        req.flash('success_msg', 'You are have Uploaded');
        res.redirect('/dashboard');
      });
    }
  });
};

exports.document_post_get = function (req, res) {
  res.render('./uploads/post', {
    current: 'Upload',
    user: req.user,
  });
};

exports.document_post_post = function (req, res) {
  const { title, post, links, tags } = req.body;
  var typeID = '5cb2db77ef58e46ad681be94'; //Document
  const errors = [];
  if (!title || !post) {
    errors.push({ msg: 'Please enter Post & Title' });
  }
  if (errors.length > 0) {
    res.render('./uploads/post', {
      errors,
      title,
      post,
      links,
      tags,
      current: 'Upload',
    });
  } else {
    const text = new Text({
      title,
      post,
      links,
      tags,
      _user: req.user._id,
      _type: typeID,
    });
    console.log(text);
    text.save(function (err, text) {
      if (err) return res.send(err);
      User.findById(req.user._id, function (err, user) {
        if (err) return res.send(err);
        user.texts.push(text._id);
        user.save();
        console.log({ text, user });
      });
      Type.findById('5cb2db77ef58e46ad681be94', function (err, type) {
        if (err) return res.send(err);
        type.texts.push(text._id);
        type.save();
        console.log({ type });
      });
      console.log('saved');
      req.flash('success_msg', 'You are have Uploaded');
      res.redirect('/dashboard');
    });
  }
};

//Notice
//All controls  ObjectId("5cb2db55ef58e46ad681be7e")

exports.notice = function (req, res) {
  res.render('./uploads/notice', {
    current: 'Upload',
    user: req.user,
  });
};

exports.notice_photo_get = function (req, res) {
  res.render('./uploads/photo', {
    current: 'Upload',
    user: req.user._id,
  });
};

exports.notice_photo_post = function (req, res) {
  uploadPhoto(req, res, (err) => {
    var fullPath = 'photos/' + req.file.filename;
    const { title, discription, caption } = req.body;
    var typeID = '5cb2db55ef58e46ad681be7e'; //Document
    const errors = [];
    if (!title || !discription || !caption) {
      errors.push({ msg: 'Please enter all fields' });
    }
    if (errors.length > 0) {
      res.render('./uploads/photo', {
        errors,
        title,
        discription,
        caption,
        current: 'Upload',
      });
    } else {
      const photo = new Photo({
        title,
        path: fullPath,
        discription,
        caption,
        _user: req.user._id,
        _type: typeID,
      });
      console.log(photo);
      photo.save(function (err, photo) {
        if (err) return res.send(err);
        User.findById(req.user._id, function (err, user) {
          if (err) return res.send(err);
          user.photos.push(photo._id);
          user.save();
          console.log({ photo, user });
        });
        Type.findById('5cb2db55ef58e46ad681be7e', function (err, type) {
          if (err) return res.send(err);
          type.photos.push(photo._id);
          type.save();
          console.log({ type });
        });
        console.log('saved');
        req.flash('success_msg', 'You are have Uploaded');
        res.redirect('/dashboard');
      });
    }
  });
};

exports.notice_pdf_get = function (req, res) {
  res.render('./uploads/pdf', {
    current: 'Upload',
    user: req.user,
  });
};

exports.notice_pdf_post = function (req, res) {
  uploadPDF(req, res, (err) => {
    var fullPath = 'pdfs/' + req.file.filename;
    const { title, discription, caption } = req.body;
    var typeID = '5cb2db55ef58e46ad681be7e'; //Document
    const errors = [];
    if (!title || !discription || !caption) {
      errors.push({ msg: 'Please enter all fields' });
    }
    if (errors.length > 0) {
      res.render('./uploads/pdf', {
        errors,
        title,
        discription,
        caption,
        current: 'Upload',
      });
    } else {
      const pdf = new Pdf({
        title,
        path: fullPath,
        discription,
        caption,
        _user: req.user._id,
        _type: typeID,
      });
      console.log(pdf);
      pdf.save(function (err, pdf) {
        if (err) return res.send(err);
        User.findById(req.user._id, function (err, user) {
          if (err) return res.send(err);
          user.pdfs.push(pdf._id);
          user.save();
          console.log({ pdf, user });
        });
        Type.findById('5cb2db55ef58e46ad681be7e', function (err, type) {
          if (err) return res.send(err);
          type.pdfs.push(pdf._id);
          type.save();
          console.log({ type });
        });
        console.log('saved');
        req.flash('success_msg', 'You are have Uploaded');
        res.redirect('/dashboard');
      });
    }
  });
};

exports.notice_post_get = function (req, res) {
  res.render('./uploads/post', {
    current: 'Upload',
    user: req.user,
  });
};

exports.notice_post_post = function (req, res) {
  const { title, post, links, tags } = req.body;
  var typeID = '5cb2db55ef58e46ad681be7e'; //Document
  const errors = [];
  if (!title || !post) {
    errors.push({ msg: 'Please enter Post & Title' });
  }
  if (errors.length > 0) {
    res.render('./uploads/post', {
      errors,
      title,
      post,
      links,
      tags,
      current: 'Upload',
    });
  } else {
    const text = new Text({
      title,
      post,
      links,
      tags,
      _user: req.user._id,
      _type: typeID,
    });
    text.save(function (err, text) {
      if (err) return res.send(err);
      User.findById(req.user._id, function (err, user) {
        if (err) return res.send(err);
        user.texts.push(text._id);
        user.save();
        console.log({ text, user });
      });
      Type.findById('5cb2db55ef58e46ad681be7e', function (err, type) {
        if (err) return res.send(err);
        type.texts.push(text._id);
        type.save();
        console.log({ type });
      });
      console.log('saved');
      req.flash('success_msg', 'You are have Uploaded');
      res.redirect('/dashboard');
    });
  }
};
