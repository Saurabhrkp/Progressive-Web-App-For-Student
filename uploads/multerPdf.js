const multer = require('multer');
const path = require('path');

/** Storage Engine */
const storageEngine = multer.diskStorage({
  destination: './uploads/pdfs',
  filename: function(req, file, fn) {
    fn(
      null,
      new Date().getTime().toString() +
        '-' +
        file.fieldname +
        path.extname(file.originalname)
    );
  }
});

//init

const uploadPdf = multer({
  storage: storageEngine,
  limits: { fileSize: 20000000 },
  fileFilter: function(req, file, callback) {
    validateFile(file, callback);
  }
}).single('pdf');

var validateFile = function(file, cb) {
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

module.exports = uploadPdf;
