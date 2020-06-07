const multer = require('multer');

const uploadImage = multer({
  dest: 'storage/images',
  limits: {
    /** 1 MB */
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
      return cb(new Error('Please upload image (.png or .jpg or .jpeg)!'));
    }
    cb(null, true);
  },
});

const uploadFile = multer({
  dest: 'storage/documents',
  limits: {
    /** 1 MB */
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(doc|docx|pdf)$/)) {
      return cb(new Error('Please upload file (.pdf or .doc or .docx)!'));
    }
    return cb(null, true);
  },
});

const uploadAvatar = multer({
  limits: {
    /** 1 MB */
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
      return cb(new Error('Please upload image (.png or .jpg or .jpeg)!'));
    }
    cb(null, true);
  },
});

module.exports = {
  uploadFile,
  uploadImage,
  uploadAvatar,
};
