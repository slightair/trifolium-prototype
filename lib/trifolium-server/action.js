var Action, MoveAction, SearchAction, WaitAction,
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Action = (function() {

  function Action() {
    this.name = null;
    if (this.time == null) this.time = 0;
  }

  Action.prototype.prepare = function(brave) {};

  Action.prototype["do"] = function(brave) {
    brave.action = null;
    brave.actionProcess = 0.0;
    return {
      isSucceed: false
    };
  };

  Action.prototype.after = function(brave, nextAction) {
    var _ref;
    nextAction.prepare(brave);
    brave.action = nextAction;
    return brave.destination = (_ref = nextAction.to) != null ? _ref : brave.spot;
  };

  Action.prototype.details = function() {
    return {
      time: 0
    };
  };

  return Action;

})();

WaitAction = (function(_super) {

  __extends(WaitAction, _super);

  function WaitAction(time) {
    this.time = time;
    WaitAction.__super__.constructor.apply(this, arguments);
    this.name = 'wait';
  }

  WaitAction.prototype["do"] = function(brave) {
    WaitAction.__super__["do"].call(this, brave);
    this.after(brave, brave.spot.randomAction());
    return {
      isSucceed: true
    };
  };

  WaitAction.prototype.details = function() {
    return {
      time: this.time,
      name: this.name
    };
  };

  return WaitAction;

})(Action);

MoveAction = (function(_super) {

  __extends(MoveAction, _super);

  function MoveAction(from, to) {
    this.from = from;
    this.to = to;
    MoveAction.__super__.constructor.apply(this, arguments);
    this.name = 'move';
    this.time = this.from.distance(this.to) * 100;
  }

  MoveAction.prototype["do"] = function(brave) {
    MoveAction.__super__["do"].call(this, brave);
    brave.spot = this.to;
    this.after(brave, this.to.randomAction());
    return {
      isSucceed: true
    };
  };

  MoveAction.prototype.details = function() {
    return {
      time: this.time,
      name: this.name,
      from: this.from.id,
      to: this.to.id
    };
  };

  return MoveAction;

})(Action);

SearchAction = (function(_super) {

  __extends(SearchAction, _super);

  SearchAction.prototype.probabilityMax = 1000;

  function SearchAction(time, treasureDict) {
    this.time = time;
    this.treasureDict = treasureDict != null ? treasureDict : {};
    SearchAction.__super__.constructor.apply(this, arguments);
    this.name = 'search';
  }

  SearchAction.prototype["do"] = function(brave) {
    var i, id, isSucceed, needle, probabilities, probability, total, treasure, treasureIds, treasureInfo, _len, _ref;
    SearchAction.__super__["do"].call(this, brave);
    total = 0;
    _ref = this.treasureDict;
    for (id in _ref) {
      treasureInfo = _ref[id];
      total += treasureInfo.probability;
    }
    if (total > this.probabilityMax) {
      return {
        isSucceed: false,
        treasure: null
      };
    }
    treasureIds = ((function() {
      var _ref2, _results;
      _ref2 = this.treasureDict;
      _results = [];
      for (id in _ref2) {
        treasureInfo = _ref2[id];
        _results.push(id);
      }
      return _results;
    }).call(this)).sort(function(a, b) {
      return 0.5 - Math.random();
    });
    probability = 0;
    probabilities = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = treasureIds.length; _i < _len; _i++) {
        id = treasureIds[_i];
        _results.push(probability += this.treasureDict[id].probability);
      }
      return _results;
    }).call(this);
    needle = Math.random() * this.probabilityMax;
    for (i = 0, _len = treasureIds.length; i < _len; i++) {
      id = treasureIds[i];
      if (!(typeof treasure !== "undefined" && treasure !== null) && needle < probabilities[i]) {
        treasure = this.treasureDict[id].item;
      }
    }
    isSucceed = null;
    if (treasure && brave.addItem(treasure)) {
      isSucceed = true;
    } else {
      isSucceed = false;
    }
    this.after(brave, brave.spot.randomAction());
    return {
      isSucceed: isSucceed,
      treasure: treasure
    };
  };

  SearchAction.prototype.details = function() {
    return {
      time: this.time,
      name: this.name
    };
  };

  return SearchAction;

})(Action);

exports.Action = Action;

exports.WaitAction = WaitAction;

exports.MoveAction = MoveAction;

exports.SearchAction = SearchAction;