const multer = require("multer");

const IMAGE_MIME_TYPE = ["image/png", "image/jpg", "image/jpeg"];

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + `-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (IMAGE_MIME_TYPE.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const registerMulter = multer({
  storage: fileStorage,
  fileFilter: fileFilter
}).single("image");

exports.registerMulter = registerMulter;
