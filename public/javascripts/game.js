var Action, Brave, Game, MoveAction, SearchAction, Spot, Trifolium, WaitAction, settings, _ref, _ref2,
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Action = (function() {

  function Action() {
    this.name = null;
    this.isSucceed = false;
    this.time = 0;
  }

  Action.prototype.prepare = function(brave) {};

  Action.prototype["do"] = function(brave) {
    brave.action = null;
    brave.actionProcess = 0.0;
    brave.doneAction(this);
    return this.isSucceed = false;
  };

  Action.prototype.after = function(brave, nextAction) {
    var _ref;
    nextAction.prepare(brave);
    brave.action = nextAction;
    return brave.destination = (_ref = nextAction.to) != null ? _ref : brave.spot;
  };

  return Action;

})();

WaitAction = (function(_super) {

  __extends(WaitAction, _super);

  function WaitAction(time) {
    WaitAction.__super__.constructor.apply(this, arguments);
    this.name = 'wait';
    this.time = time;
  }

  WaitAction.prototype["do"] = function(brave) {
    WaitAction.__super__["do"].call(this, brave);
    this.after(brave, brave.spot.randomAction());
    return this.isSucceed = true;
  };

  return WaitAction;

})(Action);

MoveAction = (function(_super) {

  __extends(MoveAction, _super);

  function MoveAction(from, to) {
    MoveAction.__super__.constructor.apply(this, arguments);
    this.name = 'move';
    this.from = from;
    this.to = to;
    this.time = from.distance(to) * 100;
  }

  MoveAction.prototype["do"] = function(brave) {
    MoveAction.__super__["do"].call(this, brave);
    brave.spot = this.to;
    this.after(brave, this.to.randomAction());
    return this.isSucceed = true;
  };

  return MoveAction;

})(Action);

SearchAction = (function(_super) {

  __extends(SearchAction, _super);

  SearchAction.prototype.probabilityMax = 1000;

  function SearchAction(treasureDict) {
    SearchAction.__super__.constructor.apply(this, arguments);
    this.name = 'search';
    this.treasureDict = treasureDict;
    this.treasure = null;
    this.time = 1000;
  }

  SearchAction.prototype["do"] = function(brave) {
    var i, needle, probabilities, probability, total, treasure, treasures, _len, _ref;
    SearchAction.__super__["do"].call(this, brave);
    total = 0;
    _ref = this.treasureDict;
    for (treasure in _ref) {
      probability = _ref[treasure];
      total += probability;
    }
    if (total > this.probabilityMax) return this.isSucceed = false;
    treasures = ((function() {
      var _ref2, _results;
      _ref2 = this.treasureDict;
      _results = [];
      for (treasure in _ref2) {
        probability = _ref2[treasure];
        _results.push(treasure);
      }
      return _results;
    }).call(this)).sort(function(a, b) {
      return 0.5 - Math.random();
    });
    probability = 0;
    probabilities = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = treasures.length; _i < _len; _i++) {
        treasure = treasures[_i];
        _results.push(probability += this.treasureDict[treasure]);
      }
      return _results;
    }).call(this);
    needle = Math.random() * this.probabilityMax;
    for (i = 0, _len = treasures.length; i < _len; i++) {
      treasure = treasures[i];
      if (!(this.treasure != null) && needle < probabilities[i]) {
        this.treasure = treasure;
      }
    }
    return this.isSucceed = this.treasure != null;
  };

  return SearchAction;

})(Action);

if (typeof exports !== "undefined" && exports !== null) exports.Action = Action;

if (typeof exports !== "undefined" && exports !== null) {
  exports.WaitAction = WaitAction;
}

if (typeof exports !== "undefined" && exports !== null) {
  exports.MoveAction = MoveAction;
}

if (typeof exports !== "undefined" && exports !== null) {
  exports.SearchAction = SearchAction;
}

Brave = (function() {

  function Brave(name, spawnSpot, options) {
    var _ref, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8;
    this.name = name;
    if (options == null) options = {};
    this.listeners = [];
    this.lv = (_ref = options.lv) != null ? _ref : 1;
    this.atk = (_ref2 = options.atk) != null ? _ref2 : 1;
    this.matk = (_ref3 = options.matk) != null ? _ref3 : 1;
    this.hp = (_ref4 = options.hp) != null ? _ref4 : 10;
    this.mp = (_ref5 = options.mp) != null ? _ref5 : 10;
    this.brave = (_ref6 = options.brave) != null ? _ref6 : 50;
    this.faith = (_ref7 = options.faith) != null ? _ref7 : 50;
    this.speed = (_ref8 = options.speed) != null ? _ref8 : 3;
    this.action = null;
    this.actionProcess = 0.0;
    this.spot = spawnSpot;
    this.destination = spawnSpot;
  }

  Brave.prototype.tick = function() {
    var isSucceed;
    if (this.action != null) {
      this.actionProcess += this.action.time > 0 ? this.speed / this.action.time : 1.0;
      if (this.actionProcess >= 1.0) {
        return isSucceed = this.action["do"](this);
      } else {
        return null;
      }
    } else {
      return null;
    }
  };

  Brave.prototype.addListener = function(listener) {
    return this.listeners.push(listener);
  };

  Brave.prototype.removeListener = function(remove) {
    var listener;
    return this.listeners = (function() {
      var _i, _len, _ref, _results;
      _ref = this.listeners;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        listener = _ref[_i];
        if (listener !== remove) _results.push(listener);
      }
      return _results;
    }).call(this);
  };

  Brave.prototype.doneAction = function(action) {
    var listener, _i, _len, _ref, _results;
    _ref = this.listeners;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      listener = _ref[_i];
      _results.push(listener.completeBraveAction(this, action));
    }
    return _results;
  };

  return Brave;

})();

if (typeof exports !== "undefined" && exports !== null) exports.Brave = Brave;

if (typeof require !== "undefined" && require !== null) {
  _ref = require('./action'), Action = _ref.Action, WaitAction = _ref.WaitAction, MoveAction = _ref.MoveAction, SearchAction = _ref.SearchAction;
}

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

if (typeof require !== "undefined" && require !== null) {
  Brave = require('./trifolium/brave').Brave;
  Spot = require('./trifolium/spot').Spot;
  _ref2 = require('./trifolium/action'), Action = _ref2.Action, WaitAction = _ref2.WaitAction, MoveAction = _ref2.MoveAction, SearchAction = _ref2.SearchAction;
}

Trifolium = (function() {

  function Trifolium(settings) {
    var action, brave, braveNameList, moveAction, moveActionList, name, routeInfo, routeInfoList, spawnSpot, spawnSpotName, spot, spot1, spot2, spotInfo, spotInfoList, _i, _j, _k, _l, _len, _len2, _len3, _len4, _ref3, _ref4, _ref5;
    spotInfoList = settings.spotInfoList, routeInfoList = settings.routeInfoList, spawnSpotName = settings.spawnSpotName, braveNameList = settings.braveNameList;
    this.spotList = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = spotInfoList.length; _i < _len; _i++) {
        spotInfo = spotInfoList[_i];
        _results.push(new Spot(spotInfo.name, spotInfo.posX, spotInfo.posY, spotInfo.actions));
      }
      return _results;
    })();
    this.routeList = [];
    moveActionList = [];
    for (_i = 0, _len = routeInfoList.length; _i < _len; _i++) {
      routeInfo = routeInfoList[_i];
      spot1 = this.spotForName(routeInfo[0]);
      spot2 = this.spotForName(routeInfo[1]);
      moveActionList.push(new MoveAction(spot1, spot2));
      moveActionList.push(new MoveAction(spot2, spot1));
      this.routeList.push([spot1, spot2]);
    }
    spawnSpot = this.spotForName(spawnSpotName);
    _ref3 = this.spotList;
    for (_j = 0, _len2 = _ref3.length; _j < _len2; _j++) {
      spot = _ref3[_j];
      for (_k = 0, _len3 = moveActionList.length; _k < _len3; _k++) {
        moveAction = moveActionList[_k];
        if (moveAction.from === spot) spot.actions.push(moveAction);
      }
    }
    this.braveList = (function() {
      var _l, _len4, _results;
      _results = [];
      for (_l = 0, _len4 = braveNameList.length; _l < _len4; _l++) {
        name = braveNameList[_l];
        _results.push(new Brave(name, spawnSpot, {
          speed: Math.floor(Math.random() * 50) + 20
        }));
      }
      return _results;
    })();
    _ref4 = this.braveList;
    for (_l = 0, _len4 = _ref4.length; _l < _len4; _l++) {
      brave = _ref4[_l];
      brave.addListener(this);
      action = brave.spot.randomAction();
      action.prepare(brave);
      brave.action = action;
      brave.destination = (_ref5 = action.to) != null ? _ref5 : brave.spot;
    }
  }

  Trifolium.prototype.start = function() {
    var timer,
      _this = this;
    this.count = 0;
    return timer = setInterval(function() {
      _this.tick();
      return _this.count++;
    }, 30);
  };

  Trifolium.prototype.tick = function() {
    var brave, _i, _len, _ref3, _results;
    _ref3 = this.braveList;
    _results = [];
    for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
      brave = _ref3[_i];
      _results.push(brave.tick());
    }
    return _results;
  };

  Trifolium.prototype.completeBraveAction = function(brave, action) {};

  Trifolium.prototype.spotForName = function(name) {
    var spot;
    return ((function() {
      var _i, _len, _ref3, _results;
      _ref3 = this.spotList;
      _results = [];
      for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
        spot = _ref3[_i];
        if (spot.name === name) _results.push(spot);
      }
      return _results;
    }).call(this))[0];
  };

  return Trifolium;

})();

if (typeof exports !== "undefined" && exports !== null) {
  exports.Trifolium = Trifolium;
}

settings = {
  "spawnSpotName": "castle",
  "spotInfoList": [
    {
      "name": "townA",
      "posX": 20,
      "posY": -60,
      "actions": [
        {
          "type": "wait",
          "time": 3000
        }
      ]
    }, {
      "name": "townB",
      "posX": -100,
      "posY": -20,
      "actions": [
        {
          "type": "wait",
          "time": 3000
        }
      ]
    }, {
      "name": "townC",
      "posX": 20,
      "posY": 40,
      "actions": [
        {
          "type": "wait",
          "time": 3000
        }
      ]
    }, {
      "name": "dungeonA",
      "posX": 120,
      "posY": -80,
      "actions": [
        {
          "type": "wait",
          "time": 3000
        }
      ]
    }, {
      "name": "dungeonB",
      "posX": -60,
      "posY": -80,
      "actions": [
        {
          "type": "wait",
          "time": 3000
        }
      ]
    }, {
      "name": "dungeonC",
      "posX": -80,
      "posY": 60,
      "actions": [
        {
          "type": "wait",
          "time": 3000
        }
      ]
    }, {
      "name": "castle",
      "posX": -40,
      "posY": 0,
      "actions": [
        {
          "type": "wait",
          "time": 3000
        }
      ]
    }, {
      "name": "temple",
      "posX": 60,
      "posY": -20,
      "actions": [
        {
          "type": "wait",
          "time": 3000
        }
      ]
    }
  ],
  "routeInfoList": [["townA", "dungeonB"], ["townA", "castle"], ["townA", "temple"], ["townB", "dungeonB"], ["townB", "castle"], ["townC", "castle"], ["townC", "temple"], ["dungeonA", "temple"], ["dungeonC", "castle"]],
  "braveNameList": ['anderson', 'bob', 'clarisse', 'daniel', 'eric', 'fredelic', 'george', 'heinkel', 'iris', 'jennifer', 'kirby', 'leonard', 'michael', 'nick', 'orlando', 'pierre', 'qian', 'richard', 'sara', 'thomas', 'ulrich', 'veeder', 'walter', 'xavier', 'yakov', 'zach']
};

if (typeof exports !== "undefined" && exports !== null) {
  exports.settings = settings;
}

$(function() {
  var game;
  game = new Game(600, 450);
  return game.start();
});

Game = (function() {

  function Game(width, height) {
    this.width = width;
    this.height = height;
    this.debugMatrix = __bind(this.debugMatrix, this);
    this.simulator = new Trifolium(settings);
    this.canvas = new Canvas($("#main-screen").get(0), this.width, this.height);
    this.infoLayer = new CanvasNode;
    this.mapScale = 2.0;
    this.selectedBrave = null;
  }

  Game.prototype.appendRoute = function(route) {
    var routeColor, routeObject;
    routeColor = 'rgba(0, 255, 0, 0.2)';
    routeObject = new Line(this.canvas.width / 2 + route[0].posX * this.mapScale, this.canvas.height / 2 + route[0].posY * this.mapScale, this.canvas.width / 2 + route[1].posX * this.mapScale, this.canvas.height / 2 + route[1].posY * this.mapScale, {
      stroke: routeColor,
      strokeWidth: 10 * this.mapScale,
      lineCap: 'round'
    });
    return this.canvas.append(routeObject);
  };

  Game.prototype.appendSpot = function(spot) {
    var spotObject;
    spotObject = new Circle(10 * this.mapScale, {
      id: spot.name,
      x: this.canvas.width / 2 + spot.posX * this.mapScale,
      y: this.canvas.height / 2 + spot.posY * this.mapScale,
      stroke: 'rgba(0, 0, 255, 1.0)',
      strokeWidth: this.mapScale,
      endAngle: Math.PI * 2
    });
    return this.canvas.append(spotObject);
  };

  Game.prototype.appendBrave = function(brave) {
    var body, braveObject, color, head,
      _this = this;
    braveObject = new CanvasNode({
      id: brave.name,
      x: this.bravePosX(brave),
      y: this.bravePosY(brave)
    });
    braveObject.addFrameListener(function(t, dt) {
      braveObject.x = _this.bravePosX(brave);
      return braveObject.y = _this.bravePosY(brave);
    });
    braveObject.addEventListener('mousedown', function(event) {
      return _this.selectedBrave = brave;
    });
    color = "hsla(" + (parseInt(Math.random() * 360)) + ", 70%, 50%, 1.0)";
    head = new Circle(2 * this.mapScale, {
      x: 0,
      y: -2 * this.mapScale,
      fill: color,
      endAngle: Math.PI * 2
    });
    body = new Rectangle(4 * this.mapScale, 4 * this.mapScale, {
      x: -2 * this.mapScale,
      y: 0,
      fill: color
    });
    braveObject.append(head);
    braveObject.append(body);
    return this.canvas.append(braveObject);
  };

  Game.prototype.displayBraveInfo = function(brave) {
    var actionProcessPercentage, paramName, paramNames, _i, _len;
    paramNames = ['name', 'lv', 'atk', 'matk', 'hp', 'mp', 'brave', 'faith', 'speed'];
    for (_i = 0, _len = paramNames.length; _i < _len; _i++) {
      paramName = paramNames[_i];
      $("#brave-" + paramName + "-value").text(brave[paramName]);
    }
    $("#brave-position-value").text("" + brave.spot.name);
    $("#brave-action-value").text("" + brave.action.name);
    actionProcessPercentage = (brave.actionProcess * 100).toFixed(1);
    $("#brave-actionProcess-bar").text("" + actionProcessPercentage + "%");
    return $("#brave-actionProcess-bar").css("width", "" + actionProcessPercentage + "%");
  };

  Game.prototype.bravePosX = function(brave) {
    return this.canvas.width / 2 + (brave.spot.posX + (brave.destination.posX - brave.spot.posX) * brave.actionProcess) * this.mapScale;
  };

  Game.prototype.bravePosY = function(brave) {
    return this.canvas.height / 2 + (brave.spot.posY + (brave.destination.posY - brave.spot.posY) * brave.actionProcess) * this.mapScale;
  };

  Game.prototype.prepareDisplayObjects = function() {
    var brave, markerSize, route, selectedBraveMarker, spot, _i, _j, _k, _len, _len2, _len3, _ref3, _ref4, _ref5,
      _this = this;
    _ref3 = this.simulator.routeList;
    for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
      route = _ref3[_i];
      this.appendRoute(route);
    }
    _ref4 = this.simulator.spotList;
    for (_j = 0, _len2 = _ref4.length; _j < _len2; _j++) {
      spot = _ref4[_j];
      this.appendSpot(spot);
    }
    _ref5 = this.simulator.braveList;
    for (_k = 0, _len3 = _ref5.length; _k < _len3; _k++) {
      brave = _ref5[_k];
      this.appendBrave(brave);
    }
    this.debugMatrix();
    markerSize = 16 * this.mapScale;
    selectedBraveMarker = new Rectangle(markerSize, markerSize, {
      rx: 4,
      ry: 4,
      x: -markerSize,
      y: -markerSize,
      fill: "rgba(255, 128, 0, 0.3)",
      stroke: "rgba(255, 128, 0, 0.5)",
      strokeWidth: this.mapScale,
      endAngle: Math.PI * 2
    });
    selectedBraveMarker.addFrameListener(function(t, dt) {
      if (_this.selectedBrave) {
        selectedBraveMarker.x = _this.bravePosX(_this.selectedBrave) - markerSize / 2;
        return selectedBraveMarker.y = _this.bravePosY(_this.selectedBrave) - markerSize / 2;
      }
    });
    this.canvas.append(selectedBraveMarker);
    this.canvas.addFrameListener(function(t, dt) {
      if (_this.selectedBrave) return _this.displayBraveInfo(_this.selectedBrave);
    });
    return this.canvas.append(this.infoLayer);
  };

  Game.prototype.start = function() {
    this.prepareDisplayObjects();
    return this.simulator.start();
  };

  Game.prototype.debugMatrix = function() {
    var centerLineColor, gapX, gapY, gridSize, lineColor, x, y, _ref3, _ref4;
    gridSize = 10 * this.mapScale;
    lineColor = 'rgba(0, 0, 255, 0.1)';
    centerLineColor = 'rgba(0, 0, 255, 0.5)';
    gapX = this.canvas.width % gridSize / 2;
    gapY = this.canvas.height % gridSize / 2;
    for (y = 0, _ref3 = this.canvas.height / gridSize; 0 <= _ref3 ? y < _ref3 : y > _ref3; 0 <= _ref3 ? y++ : y--) {
      if (y !== this.canvas.height / 2 / gridSize) {
        this.canvas.append(new Line(0, y * gridSize + gapY, this.canvas.width, y * gridSize + gapY, {
          stroke: lineColor
        }));
      }
    }
    for (x = 0, _ref4 = this.canvas.width / gridSize; 0 <= _ref4 ? x < _ref4 : x > _ref4; 0 <= _ref4 ? x++ : x--) {
      if (x !== this.canvas.width / 2 / gridSize) {
        this.canvas.append(new Line(x * gridSize + gapX, 0, x * gridSize + gapX, this.canvas.height, {
          stroke: lineColor
        }));
      }
    }
    this.canvas.append(new Line(0, this.canvas.height / 2, this.canvas.width, this.canvas.height / 2, {
      stroke: centerLineColor
    }));
    return this.canvas.append(new Line(this.canvas.width / 2, 0, this.canvas.width / 2, this.canvas.height, {
      stroke: centerLineColor
    }));
  };

  return Game;

})();
