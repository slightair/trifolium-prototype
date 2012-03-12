var Notifier;

Notifier = (function() {

  function Notifier(options) {
    var server;
    this.mode = options != null ? options.mode : void 0;
    switch (this.mode) {
      case 'pusher':
        1;
        break;
      case 'socket.io':
        server = require('http').createServer(function(req, res) {
          res.writeHead(200, {
            'Content-Type': 'text/plain'
          });
          return res.end('Trifolium game server is running.\n');
        });
        this.socketIo = require('socket.io').listen(server);
        server.listen(options.port);
        this.socketIo.sockets.on('connection', function(socket) {});
        break;
      default:
        console.log('notifier do nothing.');
    }
  }

  Notifier.prototype.notify = function(command, data) {
    switch (this.mode) {
      case 'pusher':
        return 1;
      case 'socket.io':
        return this.socketIo.sockets.emit(command, data);
      default:
        return console.log("send " + command + ": " + data);
    }
  };

  return Notifier;

})();

exports.Notifier = Notifier;
