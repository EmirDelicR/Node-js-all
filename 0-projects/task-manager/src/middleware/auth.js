const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { tokenSecret } = require('../utils/constants');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, tokenSecret);
    const user = await User.findOne({ _id: decoded._id, token: token });
    if (!user) {
      throw new Error('User is not authenticated');
    }

    req.user = user;
    next();
  } catch (e) {
    res.status(401).send({ error: 'Please authenticate (login)!' });
  }
};

module.exports = auth;
