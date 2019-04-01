const { validationResult } = require("express-validator/check");
const User = require("../models/user");
const helpers = require("../util/helpers");

exports.signup = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect!");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  let userData = {
    email: req.body.email,
    name: req.body.name,
    password: req.body.password
  };
  try {
    const hashedPassword = await helpers.hash(userData.password);
    userData.password = hashedPassword;
    const user = new User(userData);
    const result = await user.save();

    res.status(201).json({ message: "User created!", userId: result._id });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  let userData = {
    email: req.body.email,
    password: req.body.password
  };

  let loadedUser;

  try {
    const user = await User.findOne({ email: userData.email });

    if (!user) {
      const error = new Error("A user with this email could not be found!");
      error.statusCode = 401;
      throw error;
    }
    loadedUser = user;
    const isEqual = await helpers.validateHash(
      userData.password,
      user.password
    );

    if (!isEqual) {
      const error = new Error("Wrong password!");
      error.statusCode = 401;
      throw error;
    }
    // Generate JWT (JSON WEB TOKEN)
    const tokenData = {
      email: loadedUser.email,
      userId: loadedUser._id.toString()
    };
    const token = helpers.createJWT(tokenData);

    res.status(200).json({ token: token, userId: tokenData.userId });
  } catch (err) {
    next(err);
  }
};

exports.getUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error("User not found!");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ status: user.status });
  } catch (err) {
    next(err);
  }
};

exports.setUserStatus = async (req, res, next) => {
  const newStatus = req.body.status;
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error("User not found!");
      error.statusCode = 404;
      throw error;
    }
    user.status = newStatus;
    await user.save();
    res.status(200).json({ message: "User status set successfully." });
  } catch (err) {
    next(err);
  }
};
