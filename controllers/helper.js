const mongoose = require('mongoose');
const Multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const path = require('path');

let GFS;

mongoose.connection.once('open', () => {
  GFS = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: process.env.BUCKET_NAME,
  });
});

const storage = new GridFsStorage({
  url: process.env.MONGODB_URI,
  file: (req, file) => {
    return {
      bucketName: process.env.BUCKET_NAME,
      filename: `${Date.now()}${path.extname(file.originalname)}`,
    };
  },
});

const validatePDF = function (file, cb) {
  allowedFileTypes = /pdf/;
  const extension = allowedFileTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimeType = allowedFileTypes.test(file.mimetype);
  if (extension && mimeType) {
    return cb(null, true);
  } else {
    cb('Invalid file type. Only PDF file is allowed.');
  }
};

const uploadPDF = Multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // no larger than 10mb, you can change as needed.
  },
  fileFilter: function (req, file, callback) {
    validatePDF(file, callback);
  },
}).single('pdf');

const validatePhoto = function (file, cb) {
  allowedFileTypes = /jpeg|jpg|png|gif/;
  const extension = allowedFileTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimeType = allowedFileTypes.test(file.mimetype);
  if (extension && mimeType) {
    return cb(null, true);
  } else {
    cb('Invalid file type. Only JPEG, PNG and GIF file are allowed.');
  }
};

const uploadPhoto = Multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // no larger than 10mb, you can change as needed.
  },
  fileFilter: function (req, file, callback) {
    validatePhoto(file, callback);
  },
}).single('photo');

const sendFiles = async (req, res, next) => {
  try {
    const files = await GFS.find({ filename: req.params.filename }).toArray();
    if (!files[0] || files.length === 0) {
      return res
        .status(200)
        .json({ success: false, message: 'No files available' });
    }
    GFS.openDownloadStreamByName(req.params.filename).pipe(res);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  uploadPDF,
  uploadPhoto,
  sendFiles,
};
