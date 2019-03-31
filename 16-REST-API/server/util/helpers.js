const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const DEFAULT_PAGE = 1;
const ITEM_PRE_PAGE = 2;
const HASH_SALT = 12;
const EXPIRES_IN = "1h";

const deleteFile = filePath => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, err => {
    if (err) {
      console.log("Error from helper function deleteFile: ", err);
    }
  });
};

const createPagination = (model, page) => {
  const currentPage = page || DEFAULT_PAGE;
  const perPage = ITEM_PRE_PAGE;

  return model
    .find()
    .skip((currentPage - DEFAULT_PAGE) * perPage)
    .limit(perPage);
};

const hash = element => {
  return bcrypt.hash(element, HASH_SALT);
};

const validateHash = (element, toCompereWith) => {
  return bcrypt.compare(element, toCompereWith);
};

const createJWT = data => {
  return jwt.sign(data, process.env.MY_HASH_SECRET, { expiresIn: EXPIRES_IN });
};

const verifyJWT = token => {
  return jwt.verify(token, process.env.MY_HASH_SECRET);
};

exports.deleteFile = deleteFile;
exports.createPagination = createPagination;
exports.hash = hash;
exports.validateHash = validateHash;
exports.createJWT = createJWT;
exports.verifyJWT = verifyJWT;
