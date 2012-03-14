var EventEmitter, Notifier,
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

EventEmitter = require('events').EventEmitter;

Notifier = (function(_super) {

  __extends(Notifier, _super);

  function Notifier(options) {
    var server,
      _this = this;
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
        this.socketIo.sockets.on('connection', function(socket) {
          return _this.emit('connection', {
            notify: function(command, data) {
              return socket.emit(command, data);
            }
          });
        });
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

})(EventEmitter);

exports.Notifier = Notifier;
