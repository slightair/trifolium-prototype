var ActionInfo, BraveInfo, Game, ItemInfo, Receiver, SpotInfo, Trifolium,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __slice = Array.prototype.slice;

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

  BraveInfo.prototype.addItem = function(item) {
    return this.items.push(item);
  };

  BraveInfo.prototype.updateActionProcess = function(gameTimeInterval) {
    if ((this.action != null) && this.actionProcess < 1.0) {
      this.actionProcess += this.action.time > 0 ? (this.speed * gameTimeInterval) / this.action.time : 1.0;
      if (this.actionProcess > 1.0) return this.actionProcess = 1.0;
    }
  };

  BraveInfo.prototype.updateAction = function(action) {
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
    receiver = new Receiver(config.websocket);
    this.spotList = [];
    this.routeList = [];
    this.braveList = [];
    this.eventDict = {};
    receiver.bind('restoreGameStatus', this.receiveRestoreGameStatus);
    receiver.bind('braveCompleteAction', this.receiveBraveCompleteAction);
  }

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
    this.tickInterval = details.tickInterval;
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
    this.restoreGameStatus(details);
    return this.emit('restoreGameStatus');
  };

  Trifolium.prototype.receiveBraveCompleteAction = function(details) {
    var brave, nextAction, prevAction;
    brave = this.braveForId(details.brave);
    prevAction = brave.action;
    nextAction = new ActionInfo(details.nextAction);
    brave.spot = details.completeAction.name === 'move' ? this.spotForId(details.completeAction.to) : brave.spot;
    brave.destination = details.nextAction.name === 'move' ? this.spotForId(details.nextAction.to) : brave.spot;
    if (details.completeAction.name === 'search') {
      if (details.result.isSucceed && details.result.treasure) {
        brave.addItem(new ItemInfo(details.result.treasure));
      }
    }
    brave.updateAction(nextAction);
    return this.emit('braveCompleteAction', brave, prevAction, details.result);
  };

  return Trifolium;

})();

if (typeof exports !== "undefined" && exports !== null) {
  exports.Trifolium = Trifolium;
}

$(function() {
  var game;
  return game = new Game(580, 450);
});

Game = (function() {

  function Game(width, height) {
    var _this = this;
    this.width = width;
    this.height = height;
    this.trifolium = new Trifolium(trifoliumConfig);
    this.canvas = new Canvas($("#main-screen").get(0), this.width, this.height);
    this.infoLayer = new CanvasNode;
    this.mapScale = 2.0;
    this.selectedBrave = null;
    this.braveObjects = [];
    this.logMax = 6;
    this.trifolium.on('restoreGameStatus', function() {
      return _this.prepareDisplayObjects();
    });
    this.trifolium.on('braveCompleteAction', function(brave, action, result) {
      return _this.braveCompleteAction(brave, action, result);
    });
  }

  Game.prototype.appendRoute = function(route) {
    var routeColor, routeObject;
    routeColor = '#a8ff60';
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
      id: spot.id,
      x: this.canvas.width / 2 + spot.posX * this.mapScale,
      y: this.canvas.height / 2 + spot.posY * this.mapScale,
      stroke: '#0000ff',
      strokeWidth: this.mapScale,
      endAngle: Math.PI * 2
    });
    return this.canvas.append(spotObject);
  };

  Game.prototype.appendBrave = function(brave) {
    var body, braveObject, color, head,
      _this = this;
    braveObject = new CanvasNode({
      id: brave.id,
      x: this.bravePosX(brave),
      y: this.bravePosY(brave),
      addedActionEffect: false
    });
    braveObject.addFrameListener(function(t, dt) {
      var actionProcessPercentage, gameTimeInterval;
      braveObject.x = _this.bravePosX(brave);
      braveObject.y = _this.bravePosY(brave);
      gameTimeInterval = dt / _this.trifolium.tickInterval;
      brave.updateActionProcess(gameTimeInterval);
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
    color = "hsl(" + (parseInt(Math.random() * 360)) + ", 70%, 50%)";
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
    return this.braveObjects.push(braveObject);
  };

  Game.prototype.braveCompleteAction = function(brave, action, result) {
    var arrivalSpot, braveObject;
    braveObject = this.braveObjectForId(brave.id);
    braveObject.append(this.actionEffect());
    if (brave === this.selectedBrave) {
      $("#brave-position-value").text("" + brave.spot.name);
      $("#brave-action-value").text("" + brave.action.name);
      if (action.name === 'search' && result.isSucceed && result.treasure) {
        $("#brave-item-table tbody").append($("<tr><td></td><td>" + result.treasure.name + "</td></tr>"));
      }
    }
    switch (action.name) {
      case 'move':
        arrivalSpot = this.trifolium.spotForId(action.optionalInfo.to);
        return this.log("勇者" + (this.logBraveName(brave.name)) + " が " + (this.logSpotName(arrivalSpot.name)) + " に到着しました");
      case 'wait':
        return this.log("勇者" + (this.logBraveName(brave.name)) + " はぼーっとしていた");
      case 'search':
        if (result.isSucceed) {
          return this.log("勇者" + (this.logBraveName(brave.name)) + " は " + (this.logItemName(result.treasure.name)) + " を手に入れた!");
        } else {
          if (result.treasure) {
            return this.log("勇者" + (this.logBraveName(brave.name)) + " は " + (this.logItemName(result.treasure.name)) + " を見つけたが、これ以上アイテムを持てないのであきらめた…");
          } else {
            return this.log("勇者" + (this.logBraveName(brave.name)) + " はアイテムを見つけられなかった…");
          }
        }
        break;
      default:
        return this.log("unknown event - " + action.name);
    }
  };

  Game.prototype.actionEffect = function() {
    var effect, effectTime, maxScale;
    maxScale = 20.0;
    effectTime = 800;
    effect = new Circle(1 * this.mapScale, {
      x: 0,
      y: 0,
      fill: '#ffffb6',
      endAngle: Math.PI * 2,
      opacity: 1.0
    });
    effect.addFrameListener(function(t, dt) {
      var process;
      if (this.startTime == null) this.startTime = t;
      process = (t - this.startTime) / effectTime;
      this.scale = maxScale * process;
      return this.opacity = 1 - process;
    });
    effect.after(effectTime, function() {
      return this.removeSelf();
    });
    return effect;
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

  Game.prototype.braveObjectForId = function(id) {
    var braveObject;
    return ((function() {
      var _i, _len, _ref, _results;
      _ref = this.braveObjects;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        braveObject = _ref[_i];
        if (braveObject.id === id) _results.push(braveObject);
      }
      return _results;
    }).call(this))[0];
  };

  Game.prototype.prepareDisplayObjects = function() {
    var brave, markerSize, route, selectedBraveMarker, spot, _i, _j, _k, _len, _len2, _len3, _ref, _ref2, _ref3,
      _this = this;
    _ref = this.trifolium.routeList;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      route = _ref[_i];
      this.appendRoute(route);
    }
    _ref2 = this.trifolium.spotList;
    for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
      spot = _ref2[_j];
      this.appendSpot(spot);
    }
    _ref3 = this.trifolium.braveList;
    for (_k = 0, _len3 = _ref3.length; _k < _len3; _k++) {
      brave = _ref3[_k];
      this.appendBrave(brave);
    }
    markerSize = 16 * this.mapScale;
    selectedBraveMarker = new Rectangle(markerSize, markerSize, {
      rx: 4,
      ry: 4,
      x: -markerSize,
      y: -markerSize,
      fill: '#ffb6b0',
      stroke: '#ff6c60',
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

  return Game;

})();
