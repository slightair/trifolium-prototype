var Notifier;

Notifier = (function() {

  function Notifier() {
    var server;
    server = require('http').createServer(function(req, res) {
      res.writeHead(200, {
        'Content-Type': 'text/plain'
      });
      return res.end('Trifolium game server is running.\n');
    });
    this.io = require('socket.io').listen(server);
    server.listen(6262);
    this.io.sockets.on('connection', function(socket) {});
  }

  Notifier.prototype.notify = function(command, data) {
    return this.io.sockets.emit(command, data);
  };

  return Notifier;

})();

exports.Notifier = Notifier;
