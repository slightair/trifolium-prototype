var BraveInfo;

BraveInfo = (function() {

  function BraveInfo(details) {
    var _ref, _ref10, _ref11, _ref12, _ref13, _ref14, _ref15, _ref16, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9;
    this.id = (_ref = details.id) != null ? _ref : 'unknown';
    this.name = (_ref2 = details.name) != null ? _ref2 : 'unknown';
    this.lv = (_ref3 = details.lv) != null ? _ref3 : 0;
    this.atk = (_ref4 = details.atk) != null ? _ref4 : 0;
    this.matk = (_ref5 = details.matk) != null ? _ref5 : 0;
    this.hp = (_ref6 = details.hp) != null ? _ref6 : 0;
    this.mp = (_ref7 = details.mp) != null ? _ref7 : 0;
    this.brave = (_ref8 = details.brave) != null ? _ref8 : 0;
    this.faith = (_ref9 = details.faith) != null ? _ref9 : 0;
    this.speed = (_ref10 = details.speed) != null ? _ref10 : 0;
    this.gold = (_ref11 = details.gold) != null ? _ref11 : 0;
    this.items = (_ref12 = details.items) != null ? _ref12 : [];
    this.action = (_ref13 = details.action) != null ? _ref13 : null;
    this.actionProcess = (_ref14 = details.actionProcess) != null ? _ref14 : 0.0;
    this.spot = (_ref15 = details.spot) != null ? _ref15 : null;
    this.destination = (_ref16 = details.destination) != null ? _ref16 : null;
  }

  BraveInfo.prototype.tick = function() {
    if ((this.action != null) && this.actionProcess < 1.0) {
      return this.actionProcess += this.action.time > 0 ? this.speed / this.action.time : 1.0;
    }
  };

  BraveInfo.prototype.setNextAction = function(action) {
    this.action = action;
    return this.actionProcess = 0.0;
  };

  return BraveInfo;

})();

if (typeof exports !== "undefined" && exports !== null) {
  exports.BraveInfo = BraveInfo;
}