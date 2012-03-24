var EventEmitter, Notifier,
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

EventEmitter = require('events').EventEmitter;

Notifier = (function(_super) {

  __extends(Notifier, _super);

  function Notifier(server, options) {
    var Pusher,
      _this = this;
    this.server = server;
    this.mode = options != null ? options.mode : void 0;
    switch (this.mode) {
      case 'pusher':
        Pusher = require('node-pusher');
        this.pusher = new Pusher({
          appId: options.pusherAppId,
          key: options.pusherTokenKey,
          secret: options.pusherTokenSecret
        });
        break;
      case 'socket.io':
        this.socketIo = require('socket.io').listen(this.server);
        this.socketIo.configure(function() {
          this.set('transports', ['xhr-polling']);
          return this.set('polling duration', 10);
        });
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
        return this.pusher.trigger('trifolium', command, data);
      case 'socket.io':
        return this.socketIo.sockets.emit(command, data);
      default:
        return console.log("send " + command + ": " + data);
    }
  };

  return Notifier;

})(EventEmitter);

exports.Notifier = Notifier;
