var Receiver;

Receiver = (function() {

  function Receiver(options) {
    var socket_io;
    this.mode = options != null ? options.mode : void 0;
    switch (this.mode) {
      case 'pusher':
        1;
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
    var _ref;
    switch (this.mode) {
      case 'pusher':
        1;
        break;
      case 'socket.io':
        if ((_ref = this.socket) != null) _ref.on(command, callback);
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
