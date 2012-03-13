(function() {
  var Receiver, receiver;

  Receiver = require('./lib/trifolium-client/receiver').Receiver;

  receiver = new Receiver({
    mode: 'socket.io',
    host: "http://localhost:6262"
  });

  receiver.bind('completeAction', function(details) {
    return console.log(details);
  });

}).call(this);
