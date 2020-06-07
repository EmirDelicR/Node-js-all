const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const { uploadImage, uploadFile } = require('../utils/fileUpload');
const { errorHandler } = require('../middleware/error');

router.post(
  '/uploadImage',
  [auth, uploadImage.single('image')],
  uploadController.uploadImage,
  errorHandler
);

router.post(
  '/uploadFile',
  [auth, uploadFile.single('file')],
  uploadController.uploadFile,
  errorHandler
);

module.exports = router;
