var ActionInfo, BraveInfo, ItemInfo, Receiver, SpotInfo, Trifolium,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __slice = Array.prototype.slice;

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
    brave.setNextAction(nextAction);
    return this.emit('braveCompleteAction', brave, prevAction, details.result);
  };

  return Trifolium;

})();

if (typeof exports !== "undefined" && exports !== null) {
  exports.Trifolium = Trifolium;
}
