(function() {
  var Receiver, receiver, settings;

  Receiver = require('./lib/trifolium-client/receiver').Receiver;

  settings = require('./settings').settings;

  receiver = new Receiver({
    mode: 'socket.io',
    host: "http://localhost:6262"
  });

  receiver.bind('completeAction', function(details) {
    return console.log(details);
  });

}).call(this);
