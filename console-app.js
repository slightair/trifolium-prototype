(function() {
  var io, settings, socket;

  settings = require('./settings').settings;

  io = require('socket.io-client');

  socket = io.connect('http://localhost:6262');

  socket.on('completeAction', function(details) {
    return console.log(details);
  });

}).call(this);
