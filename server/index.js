const express = require('express');
const path = require('path');
const _get = require('lodash/get');
const { spawn } = require('child_process');
const bodyParser = require('body-parser');
const logger = require('morgan');

const app = express();

const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = process.env.SERVER_PORT || 3000;

const routes = require('./routes')(io);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'viewer')));

app.post('/api/data', routes.pythonController);

server.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});
