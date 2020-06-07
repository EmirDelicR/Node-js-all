const express = require('express');
const dotenv = require('dotenv');

const taskRoutes = require('./routes/task');
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');

dotenv.config({ debug: true });
const app = express();
app.use(express.json());

app.use(taskRoutes);
app.use(userRoutes);
app.use(authRoutes);

module.exports = app;
