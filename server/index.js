const express = require('express');
const path = require('path');
const _get = require('lodash/get');
const { spawn } = require('child_process');
const bodyParser = require('body-parser');
const logger = require('morgan');
const port = process.env.SERVER_PORT || 3000;

const app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'viewer')));

app.post('/api/data', (req, res) => {
  // Use lodash so no error is thrown if req.body is undefined
  const data = JSON.stringify(_get(req, 'body.data', []));
  //console.log(data);
  const python = spawn('python', [path.join(__dirname, 'regress.py')]);
  python.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });
  python.stdout.on('data', (data) => {
    console.log('stdout: ' + data);
  });
  python.stdout.on('end', () => {
    //console.log('ended');
  });
  python.stdin.write(data);
  python.stdin.end();
  res.end('Data received.');
});

app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});
