var ActionInfo;

ActionInfo = (function() {

  function ActionInfo(details) {
    var info, infoName, _ref, _ref2;
    this.name = (_ref = details.name) != null ? _ref : 'unknown';
    this.time = (_ref2 = details.time) != null ? _ref2 : 0;
    this.optionalInfo = {};
    for (infoName in details) {
      info = details[infoName];
      if (infoName !== 'name' && infoName !== 'time') {
        this.optionalInfo[infoName] = info;
      }
    }
  }

  return ActionInfo;

})();

if (typeof exports !== "undefined" && exports !== null) {
  exports.ActionInfo = ActionInfo;
}
