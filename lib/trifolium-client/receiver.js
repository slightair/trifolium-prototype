var Receiver;

Receiver = (function() {

  function Receiver(options) {
    var pusher, socket_io;
    this.mode = options != null ? options.mode : void 0;
    switch (this.mode) {
      case 'pusher':
        pusher = new Pusher(options.pusherTokenKey);
        this.channel = pusher.subscribe('trifolium');
        break;
      case 'socket.io':
        if (typeof require !== "undefined" && require !== null) {
          socket_io = require('socket.io-client');
          this.socket = socket_io.connect(options.host);
        } else {
          this.socket = io.connect(options.host);
        }
        break;
      default:
        console.log('receiver do nothing.');
    }
  }

  Receiver.prototype.bind = function(command, callback) {
    var _ref, _ref2;
    switch (this.mode) {
      case 'pusher':
        if ((_ref = this.channel) != null) _ref.bind(command, callback);
        break;
      case 'socket.io':
        if ((_ref2 = this.socket) != null) _ref2.on(command, callback);
        break;
      default:
        console.log("bind " + command);
    }
    return this;
  };

  return Receiver;

})();

if (typeof exports !== "undefined" && exports !== null) {
  exports.Receiver = Receiver;
}
