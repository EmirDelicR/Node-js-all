const { body } = require("express-validator/check");

module.exports = {
  postFeed: [
    body("title")
      .trim()
      .isLength({ min: 5 }),
    body("content")
      .trim()
      .isLength({ min: 5 })
  ]
};
