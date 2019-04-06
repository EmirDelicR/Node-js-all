const validator = require("validator");

const validateUser = data => {
  const errors = [];

  if (!validator.isEmail(data.email)) {
    errors.push({ message: "Email is invalid!" });
  }

  if (
    validator.isEmpty(data.password) ||
    !validator.isLength(data.password, { min: 5 })
  ) {
    errors.push({ message: "Password is invalid!" });
  }

  if (errors.length > 0) {
    const error = new Error("Invalid input.");
    error.data = errors;
    error.code = 422;
    throw error;
  }
};

const validatePost = data => {
  const errors = [];

  if (
    validator.isEmpty(data.title) ||
    !validator.isLength(data.title, { min: 5 })
  ) {
    errors.push({ message: "Title is invalid!" });
  }

  if (
    validator.isEmpty(data.content) ||
    !validator.isLength(data.content, { min: 5 })
  ) {
    errors.push({ message: "Content is invalid!" });
  }

  if (errors.length > 0) {
    const error = new Error("Invalid input.");
    error.data = errors;
    error.code = 422;
    throw error;
  }
};

exports.validateUser = validateUser;
exports.validatePost = validatePost;
