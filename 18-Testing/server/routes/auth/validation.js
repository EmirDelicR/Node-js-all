const { body } = require("express-validator/check");
const User = require("../../models/user");

module.exports = {
  postUser: [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject("E-Mail address already exist");
          }
        });
      })
      .normalizeEmail(),

    body("password")
      .trim()
      .isLength({ min: 5 }),

    body("name")
      .trim()
      .not()
      .isEmpty()
  ],

  updateStatus: [
    body("status")
      .trim()
      .not()
      .isEmpty()
      .isLength({ min: 2 })
  ]
};
