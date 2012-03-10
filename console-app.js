(function() {
  var Trifolium, io, settings, socket;

  Trifolium = require('./lib/trifolium').Trifolium;

  settings = require('./settings').settings;

  io = require('socket.io-client');

  socket = io.connect('http://localhost:6262');

  socket.on('eventlog', function(log) {
    return console.log(log);
  });

}).call(this);
