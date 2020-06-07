const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Task = require('../models/task');
const { tokenSecret } = require('../utils/constants');

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      trim: true,
      validate(value) {
        if (value === 'password') {
          throw new Error("You can not use word 'password' as password");
        }
      },
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Email is invalid!');
        }
      },
    },
    token: {
      type: String,
    },
    avatar: {
      type: Buffer,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.avatar;
  return user;
};
/** set up virtual attribute on instance  user.populate('tasks').execPopulate()*/
userSchema.virtual('tasks', {
  ref: 'Task',
  localField: '',
  foreignField: 'author',
});

/** static method on class */
userSchema.statics.findByCredentials = async function ({ email, password }) {
  const user = await this.findOne({ email: email });
  if (!user) {
    throw new Error('Invalid email!');
  }
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error('Invalid password!');
  }

  return user;
};

/** Method on instance of class */
userSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign({ _id: this._id.toString() }, tokenSecret);
  this.token = token;
  await this.save();
  return token;
};

/** This is execute before deleting user */
userSchema.pre('remove', async function (next) {
  await Task.deleteMany({ author: this._id });
  next();
});

module.exports = mongoose.model('User', userSchema);
