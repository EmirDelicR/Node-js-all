const express = require('express');
const authController = require('../controllers/auth');
const router = express.Router();
const auth = require('../middleware/auth');

router.post('/login', authController.login);
router.post('/logout', auth, authController.logout);

module.exports = router;
