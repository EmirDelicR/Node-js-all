const express = require("express");
const { check, body } = require("express-validator/check");

const authController = require("../controllers/auth");
const User = require("../models/user");

const router = express.Router();

router.get("/login", authController.getLogin);
router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter valid email!")
      .normalizeEmail(),

    body("password", "Password is not valid!")
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim()
  ],
  authController.postLogin
);

router.get("/signup", authController.getSignup);
router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter valid email!")
      .custom((value, { req }) => {
        // Async validation
        return User.findOne({ email: value }).then(user => {
          if (user) {
            return Promise.reject("Email already exist!");
          }
        });
      })
      .normalizeEmail(),

    body("password", "Please enter valid password min 5 char and alphanumeric!")
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),

    body("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Password must match!");
        }
      })
  ],
  authController.postSignup
);

router.get("/reset", authController.getReset);
router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);
router.post("/new-password", authController.postNewPassword);

router.post("/logout", authController.postLogout);

module.exports = router;
