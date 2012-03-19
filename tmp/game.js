var ActionInfo, BraveInfo, Game, ItemInfo, Receiver, SpotInfo, Trifolium, config,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __slice = Array.prototype.slice;

config = {
  websocketOptions: {
    mode: 'socket.io',
    host: 'http://localhost:6262'
  }
};

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

ItemInfo = (function() {

  function ItemInfo(details) {
    var _ref, _ref2, _ref3;
    this.id = (_ref = details.id) != null ? _ref : 'unknown';
    this.name = (_ref2 = details.name) != null ? _ref2 : 'unknown';
    this.itemId = (_ref3 = details.itemId) != null ? _ref3 : 0;
  }

  return ItemInfo;

})();

if (typeof exports !== "undefined" && exports !== null) {
  exports.ItemInfo = ItemInfo;
}

Receiver = (function() {

  function Receiver(options) {
    var io;
    this.mode = options != null ? options.mode : void 0;
    switch (this.mode) {
      case 'pusher':
        1;
        break;
      case 'socket.io':
        if (typeof require !== "undefined" && require !== null) {
          io = require('socket.io-client');
        }
        this.socket = io.connect(options.host);
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

SpotInfo = (function() {

  function SpotInfo(details) {
    var _ref, _ref2, _ref3, _ref4;
    this.id = (_ref = details.id) != null ? _ref : 'unknown';
    this.name = (_ref2 = details.name) != null ? _ref2 : 'unknown';
    this.posX = (_ref3 = details.posX) != null ? _ref3 : 0;
    this.posY = (_ref4 = details.posY) != null ? _ref4 : 0;
  }

  return SpotInfo;

})();

if (typeof exports !== "undefined" && exports !== null) {
  exports.SpotInfo = SpotInfo;
}

if (typeof require !== "undefined" && require !== null) {
  Receiver = require('./receiver').Receiver;
  BraveInfo = require("./braveInfo").BraveInfo;
  ActionInfo = require("./actionInfo").ActionInfo;
  ItemInfo = require("./itemInfo").ItemInfo;
  SpotInfo = require("./spotInfo").SpotInfo;
}

Trifolium = (function() {

  function Trifolium(config) {
    this.receiveBraveCompleteAction = __bind(this.receiveBraveCompleteAction, this);
    this.receiveRestoreGameStatus = __bind(this.receiveRestoreGameStatus, this);
    var receiver;
    receiver = new Receiver(config.websocketOptions);
    this.spotList = [];
    this.routeList = [];
    this.braveList = [];
    this.eventDict = {};
    receiver.bind('restoreGameStatus', this.receiveRestoreGameStatus);
    receiver.bind('braveCompleteAction', this.receiveBraveCompleteAction);
  }

  Trifolium.prototype.start = function() {
    var timer,
      _this = this;
    return timer = setInterval(function() {
      return _this.tick();
    }, this.tickInterval);
  };

  Trifolium.prototype.tick = function() {
    var brave, _i, _len, _ref, _results;
    _ref = this.braveList;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      brave = _ref[_i];
      _results.push(brave.tick());
    }
    return _results;
  };

  Trifolium.prototype.spotForName = function(name) {
    var spot;
    return ((function() {
      var _i, _len, _ref, _results;
      _ref = this.spotList;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        spot = _ref[_i];
        if (spot.name === name) _results.push(spot);
      }
      return _results;
    }).call(this))[0];
  };

  Trifolium.prototype.spotForId = function(id) {
    var spot;
    return ((function() {
      var _i, _len, _ref, _results;
      _ref = this.spotList;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        spot = _ref[_i];
        if (spot.id === id) _results.push(spot);
      }
      return _results;
    }).call(this))[0];
  };

  Trifolium.prototype.braveForName = function(name) {
    var brave;
    return ((function() {
      var _i, _len, _ref, _results;
      _ref = this.braveList;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        brave = _ref[_i];
        if (brave.name === name) _results.push(brave);
      }
      return _results;
    }).call(this))[0];
  };

  Trifolium.prototype.braveForId = function(id) {
    var brave;
    return ((function() {
      var _i, _len, _ref, _results;
      _ref = this.braveList;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        brave = _ref[_i];
        if (brave.id === id) _results.push(brave);
      }
      return _results;
    }).call(this))[0];
  };

  Trifolium.prototype.on = function(event, callback) {
    this.eventDict[event] = callback;
    return this;
  };

  Trifolium.prototype.emit = function() {
    var args, event, _ref;
    event = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    return (_ref = this.eventDict[event]) != null ? _ref.apply(this, args) : void 0;
  };

  Trifolium.prototype.restoreGameStatus = function(details) {
    var braveDetails, coordinateBraveDetails, routeInfo, spotDetails,
      _this = this;
    coordinateBraveDetails = function(d) {
      var itemInfo;
      d.items = (function() {
        var _i, _len, _ref, _results;
        _ref = d.items;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          itemInfo = _ref[_i];
          _results.push(new ItemInfo(itemInfo));
        }
        return _results;
      })();
      d.action = new ActionInfo(d.action);
      d.spot = _this.spotForId(d.spot);
      d.destination = _this.spotForId(d.destination);
      return d;
    };
    this.tickInterval = details.tickInterval < 100 ? 100 : details.tickInterval;
    this.spotList = (function() {
      var _i, _len, _ref, _results;
      _ref = details.spotList;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        spotDetails = _ref[_i];
        _results.push(new SpotInfo(spotDetails));
      }
      return _results;
    })();
    this.braveList = (function() {
      var _i, _len, _ref, _results;
      _ref = details.braveList;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        braveDetails = _ref[_i];
        _results.push(new BraveInfo(coordinateBraveDetails(braveDetails)));
      }
      return _results;
    })();
    return this.routeList = (function() {
      var _i, _len, _ref, _results;
      _ref = details.routeList;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        routeInfo = _ref[_i];
        _results.push([this.spotForId(routeInfo[0]), this.spotForId(routeInfo[1])]);
      }
      return _results;
    }).call(this);
  };

  Trifolium.prototype.receiveRestoreGameStatus = function(details) {
    return this.restoreGameStatus(details);
  };

  Trifolium.prototype.receiveBraveCompleteAction = function(details) {
    var brave, prevAction;
    brave = this.braveForId(details.brave);
    prevAction = brave.action;
    brave.setNextAction(new ActionInfo(details.nextAction));
    return this.emit('braveCompleteAction', brave, prevAction, details.result);
  };

  return Trifolium;

})();

if (typeof exports !== "undefined" && exports !== null) {
  exports.Trifolium = Trifolium;
}

$(function() {
  var SharedItemCreator, game;
  SharedItemCreator = new ItemCreator(itemDict);
  game = new Game(580, 450);
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
    this.logMax = 6;
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
      y: this.bravePosY(brave),
      addedActionEffect: false
    });
    braveObject.addFrameListener(function(t, dt) {
      var actionProcessPercentage;
      braveObject.x = _this.bravePosX(brave);
      braveObject.y = _this.bravePosY(brave);
      if (brave === _this.selectedBrave) {
        actionProcessPercentage = (brave.actionProcess * 100).toFixed(1);
        $("#brave-actionProcess-bar").text("" + actionProcessPercentage + "%");
        return $("#brave-actionProcess-bar").css("width", "" + actionProcessPercentage + "%");
      }
    });
    braveObject.addEventListener('mousedown', function(event) {
      _this.selectedBrave = brave;
      return _this.displayBraveInfo(brave);
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
    this.canvas.append(braveObject);
    return brave.on('completeAction', function(brave, action, result) {
      var actionEffect, circleRadiusMax, effectTime;
      circleRadiusMax = 40.0;
      effectTime = 800;
      actionEffect = new Circle(1 * _this.mapScale, {
        x: 0,
        y: 0,
        stroke: "rgba(33, 66, 255, 0.8)",
        strokeWidth: _this.mapScale,
        fill: "rgba(33, 66, 255, 0.5)",
        endAngle: Math.PI * 2,
        opacity: 1.0
      });
      actionEffect.addFrameListener(function(t, dt) {
        if (dt > effectTime) actionEffect.removeSelf;
        actionEffect.radius += dt / effectTime * circleRadiusMax;
        actionEffect.opacity = (circleRadiusMax - actionEffect.radius) / circleRadiusMax;
        if (actionEffect.radius > circleRadiusMax) {
          actionEffect.removeSelf();
          return braveObject.addedActionEffect = false;
        }
      });
      if (!braveObject.addedActionEffect) {
        braveObject.append(actionEffect);
        braveObject.addedActionEffect = true;
      }
      if (brave === _this.selectedBrave) {
        $("#brave-position-value").text("" + brave.spot.name);
        $("#brave-action-value").text("" + brave.action.name);
        if (action.name === 'search' && result.isSucceed && result.treasure) {
          $("#brave-item-table tbody").append($("<tr><td></td><td>" + result.treasure.name + "</td></tr>"));
        }
      }
      switch (action.name) {
        case 'move':
          return _this.log("勇者" + (_this.logBraveName(brave.name)) + " が " + (_this.logSpotName(action.to.name)) + " に到着しました");
        case 'wait':
          return _this.log("勇者" + (_this.logBraveName(brave.name)) + " はぼーっとしていた");
        case 'search':
          if (result.isSucceed) {
            return _this.log("勇者" + (_this.logBraveName(brave.name)) + " は " + (_this.logItemName(result.treasure.name)) + " を手に入れた!");
          } else {
            if (action.treasure) {
              return _this.log("勇者" + (_this.logBraveName(brave.name)) + " は " + (_this.logItemName(result.treasure.name)) + " を見つけたが、これ以上アイテムを持てないのであきらめた…");
            } else {
              return _this.log("勇者" + (_this.logBraveName(brave.name)) + " はアイテムを見つけられなかった…");
            }
          }
          break;
        default:
          return _this.log("unknown event - " + action.name);
      }
    });
  };

  Game.prototype.displayBraveInfo = function(brave) {
    var item, paramName, paramNames, _i, _j, _len, _len2, _ref, _results;
    paramNames = ['name', 'lv', 'atk', 'matk', 'hp', 'mp', 'brave', 'faith', 'speed'];
    for (_i = 0, _len = paramNames.length; _i < _len; _i++) {
      paramName = paramNames[_i];
      $("#brave-" + paramName + "-value").text(brave[paramName]);
    }
    $("#brave-position-value").text("" + brave.spot.name);
    $("#brave-action-value").text("" + brave.action.name);
    $("#brave-item-table tbody").empty();
    _ref = brave.items;
    _results = [];
    for (_j = 0, _len2 = _ref.length; _j < _len2; _j++) {
      item = _ref[_j];
      _results.push($("#brave-item-table tbody").append($("<tr><td></td><td>" + item.name + "</td></tr>")));
    }
    return _results;
  };

  Game.prototype.bravePosX = function(brave) {
    return this.canvas.width / 2 + (brave.spot.posX + (brave.destination.posX - brave.spot.posX) * brave.actionProcess) * this.mapScale;
  };

  Game.prototype.bravePosY = function(brave) {
    return this.canvas.height / 2 + (brave.spot.posY + (brave.destination.posY - brave.spot.posY) * brave.actionProcess) * this.mapScale;
  };

  Game.prototype.prepareDisplayObjects = function() {
    var brave, markerSize, route, selectedBraveMarker, spot, _i, _j, _k, _len, _len2, _len3, _ref, _ref2, _ref3,
      _this = this;
    _ref = this.simulator.routeList;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      route = _ref[_i];
      this.appendRoute(route);
    }
    _ref2 = this.simulator.spotList;
    for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
      spot = _ref2[_j];
      this.appendSpot(spot);
    }
    _ref3 = this.simulator.braveList;
    for (_k = 0, _len3 = _ref3.length; _k < _len3; _k++) {
      brave = _ref3[_k];
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
    this.infoLayer.append(new ElementNode(E('div', {
      id: 'log'
    }), {
      valign: "bottom",
      y: this.height
    }));
    return this.canvas.append(this.infoLayer);
  };

  Game.prototype.start = function() {
    this.prepareDisplayObjects();
    return this.simulator.start();
  };

  Game.prototype.log = function(text) {
    if (this.logMax <= $("div#log").children().length) {
      $("div#log").children(":first").remove();
    }
    return $("div#log").append($("<div class='logItem'>" + text + "</div>"));
  };

  Game.prototype.logBraveName = function(name) {
    return "<span class='log-brave-name'>" + name + "</span>";
  };

  Game.prototype.logSpotName = function(name) {
    return "<span class='log-spot-name'>" + name + "</span>";
  };

  Game.prototype.logItemName = function(name) {
    return "<span class='log-item-name'>" + name + "</span>";
  };

  Game.prototype.debugMatrix = function() {
    var centerLineColor, gapX, gapY, gridSize, lineColor, x, y, _ref, _ref2;
    gridSize = 10 * this.mapScale;
    lineColor = 'rgba(0, 0, 255, 0.1)';
    centerLineColor = 'rgba(0, 0, 255, 0.5)';
    gapX = this.canvas.width % gridSize / 2;
    gapY = this.canvas.height % gridSize / 2;
    for (y = 0, _ref = this.canvas.height / gridSize; 0 <= _ref ? y < _ref : y > _ref; 0 <= _ref ? y++ : y--) {
      if (y !== this.canvas.height / 2 / gridSize) {
        this.canvas.append(new Line(0, y * gridSize + gapY, this.canvas.width, y * gridSize + gapY, {
          stroke: lineColor
        }));
      }
    }
    for (x = 0, _ref2 = this.canvas.width / gridSize; 0 <= _ref2 ? x < _ref2 : x > _ref2; 0 <= _ref2 ? x++ : x--) {
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