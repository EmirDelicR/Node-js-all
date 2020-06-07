const User = require('../models/user');

exports.login = async (req, res, next) => {
  try {
    const user = await User.findByCredentials(req.body);
    await user.generateAuthToken();
    req.user = user;
    res.send(user);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
};

exports.logout = async (req, res, next) => {
  try {
    req.user.token = '';
    await req.user.save();
    res.send({ message: 'Successfully logout.' });
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
};
