const Task = require('../models/task');

exports.createTask = async (req, res, next) => {
  const task = new Task({ ...req.body, author: req.user._id });
  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.updateTask = async (req, res, next) => {
  const taskId = req.params.id;
  try {
    const task = await Task.findOneAndUpdate(
      { _id: taskId, author: req.user._id },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!task) {
      return res.status(404).send('No task with this ID!');
    }

    res.send(task);
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      author: req.user._id,
    });
    if (!task) {
      return res.status(404).send('No task with this ID!');
    }

    res.send(task);
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.getAllTasks = async (req, res, next) => {
  const match = {};
  const sort = {};
  /** Filter data with params /tasks?completed=true */
  if (req.query.completed) {
    match.completed = req.query.completed === 'true';
  }
  /** Sort */
  if (req.query.sortBy) {
    const parts = req.query.sortBy.split('_');
    /** Sort data /task/?sortBy=createdAt_asc (desc : -1, asc : 1) */
    sort[parts[0]] = parts[1] === 'asc' ? 1 : -1;
  }
  /** paginating /tasks/?limit=10&page=2 */
  const options = {
    limit: parseInt(req.query.limit),
    skip: parseInt(req.query.page) * limit,
    sort,
  };

  try {
    await req.user.populate({ path: 'tasks', match, options }).execPopulate();
    res.send(req.user.tasks);
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.getTaskById = async (req, res, next) => {
  const taskId = req.params.id;
  try {
    const task = await Task.findOne({ _id: taskId, author: req.user._id });
    if (!task) {
      return res.status(404).send('No task with this ID!');
    }
    res.send(task);
  } catch (e) {
    res.status(500).send(e);
  }
};
