const express = require('express');
const userController = require('../controllers/user');
const router = express.Router();
const auth = require('../middleware/auth');
const { uploadAvatar } = require('../utils/fileUpload');
const { errorHandler } = require('../middleware/error');

router.get('/users/current', auth, userController.getCurrentUser);
router.post('/users', userController.createUser);
router.patch('/users/current', auth, userController.updateUser);
router.delete('/users/current', auth, userController.deleteUser);
router.post(
  '/avatar',
  [auth, uploadAvatar.single('avatar')],
  userController.uploadAvatar,
  errorHandler
);
router.delete('/avatar', auth, userController.deleteAvatar, errorHandler);
router.get('/avatar/:userId', auth, userController.getAvatar, errorHandler);

module.exports = router;
