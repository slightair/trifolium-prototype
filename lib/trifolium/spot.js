var Action, MoveAction, SearchAction, Spot, WaitAction, _ref;

if (typeof require !== "undefined" && require !== null) {
  _ref = require('./action'), Action = _ref.Action, WaitAction = _ref.WaitAction, MoveAction = _ref.MoveAction, SearchAction = _ref.SearchAction;
}

Spot = (function() {

  function Spot(name, posX, posY, actionInfoList) {
    if (actionInfoList == null) actionInfoList = [];
    this.name = name;
    this.posX = posX;
    this.posY = posY;
    this.actions = this.makeActions(actionInfoList);
  }

  Spot.prototype.randomAction = function() {
    var index;
    index = Math.floor(Math.random() * this.actions.length);
    return this.actions[index];
  };

  Spot.prototype.distance = function(aSpot) {
    return Math.sqrt(Math.pow(this.posX - aSpot.posX, 2) + Math.pow(this.posY - aSpot.posY, 2));
  };

  Spot.prototype.makeActions = function(actionInfoList) {
    var action, actionInfo, actions, _i, _len;
    actions = [];
    if (actionInfoList != null) {
      for (_i = 0, _len = actionInfoList.length; _i < _len; _i++) {
        actionInfo = actionInfoList[_i];
        action = null;
        switch (actionInfo.type) {
          case 'wait':
            action = new WaitAction(actionInfo.time);
        }
        if (action != null) actions.push(action);
      }
    }
    return actions;
  };

  return Spot;

})();

if (typeof exports !== "undefined" && exports !== null) exports.Spot = Spot;
