const express = require('express');
const taskController = require('../controllers/task');
const auth = require('../middleware/auth');
const { errorHandler } = require('../middleware/error');
const router = express.Router();

router.get('/tasks', auth, taskController.getAllTasks, errorHandler);
router.get('/tasks/:id', auth, taskController.getTaskById, errorHandler);
router.post('/tasks', auth, taskController.createTask, errorHandler);
router.patch('/tasks/:id', auth, taskController.updateTask, errorHandler);
router.delete('/tasks/:id', auth, taskController.deleteTask, errorHandler);

module.exports = router;
