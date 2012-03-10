var Action, MoveAction, SearchAction, SharedItemCreator, Spot, WaitAction, _ref;

_ref = require('./action'), Action = _ref.Action, WaitAction = _ref.WaitAction, MoveAction = _ref.MoveAction, SearchAction = _ref.SearchAction;

SharedItemCreator = require('./item').SharedItemCreator;

Spot = (function() {

  function Spot(name, posX, posY, actionInfoList) {
    this.name = name;
    this.posX = posX;
    this.posY = posY;
    if (actionInfoList == null) actionInfoList = [];
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
    var action, actionInfo, actions, item, treasureDict, treasureInfo, _i, _j, _len, _len2, _ref2;
    actions = [];
    if (actionInfoList != null) {
      for (_i = 0, _len = actionInfoList.length; _i < _len; _i++) {
        actionInfo = actionInfoList[_i];
        action = null;
        switch (actionInfo.type) {
          case 'wait':
            action = new WaitAction(actionInfo.time);
            break;
          case 'search':
            treasureDict = {};
            _ref2 = actionInfo.treasures;
            for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
              treasureInfo = _ref2[_j];
              item = SharedItemCreator.createItem(treasureInfo.itemId, treasureInfo.name);
              treasureDict[item.id] = {
                item: item,
                probability: treasureInfo.probability
              };
            }
            action = new SearchAction(actionInfo.time, treasureDict);
        }
        if (action != null) actions.push(action);
      }
    }
    return actions;
  };

  return Spot;

})();

exports.Spot = Spot;
