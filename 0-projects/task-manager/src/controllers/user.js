const bcrypt = require('bcryptjs');
const User = require('../models/user');

exports.createUser = async (req, res, next) => {
  const data = req.body;
  try {
    const hashPassword = await bcrypt.hash(data.password, 12);
    data.password = hashPassword;
    const user = new User(data);
    await user.save();
    await user.generateAuthToken();

    res.status(201).send(user);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

exports.updateUser = async (req, res, next) => {
  const data = req.body;
  try {
    if (data.hasOwnProperty('password')) {
      const hashPassword = await bcrypt.hash(data.password, 12);
      data.password = hashPassword;
    }
    const user = await User.findByIdAndUpdate(req.user._id, data, {
      new: true,
      runValidators: true,
    });

    res.send(user);
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    await req.user.remove();
    res.send({ message: 'User successfully deleted.' });
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
};

exports.getCurrentUser = async (req, res, next) => {
  res.send(req.user);
};

exports.uploadAvatar = async (req, res, next) => {
  try {
    req.user.avatar = `data:${req.file.mimetype};base64,${req.file.buffer}`;
    await req.user.save();
    res.send({ message: 'Avatar is successfully uploaded!' });
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
};

exports.deleteAvatar = async (req, res, next) => {
  try {
    req.user.avatar = null;
    await req.user.save();
    res.send({ message: 'Avatar is successfully deleted!' });
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
};

exports.getAvatar = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user || !user.avatar) {
      throw new Error('Avatar for user is missing!');
    }

    res.set('Content-Type', 'image/jpg');
    res.send(user.avatar);
  } catch (e) {
    res.status(404).send(e);
  }
};
