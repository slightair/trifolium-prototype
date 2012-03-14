var Receiver, Trifolium;

if (typeof require !== "undefined" && require !== null) {
  Receiver = require('./receiver').Receiver;
}

Trifolium = (function() {

  function Trifolium(config) {
    var receiver;
    receiver = new Receiver(config.websocketOptions);
    receiver.bind('restoreGameStatus', this.receiveRestoreGameStatus);
    receiver.bind('braveCompleteAction', this.receiveBraveCompleteAction);
  }

  Trifolium.prototype.receiveRestoreGameStatus = function(details) {
    return console.log(details);
  };

  Trifolium.prototype.receiveBraveCompleteAction = function(details) {
    return console.log(details);
  };

  return Trifolium;

})();

if (typeof exports !== "undefined" && exports !== null) {
  exports.Trifolium = Trifolium;
}
