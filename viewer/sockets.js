var socket = io.connect('http://localhost:3000');
socket.on('data', function (data) {
  console.log(data);
});
