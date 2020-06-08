const express = require('express');
const path = require('path');
const http = require('http');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '../../', 'public')));
app.set('views', 'views');

const server = http.createServer(app);

module.exports = server;
