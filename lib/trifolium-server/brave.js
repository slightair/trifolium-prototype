var Brave, EventEmitter, crypto,
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

crypto = require('crypto');

EventEmitter = require('events').EventEmitter;

Brave = (function(_super) {

  __extends(Brave, _super);

  function Brave(name, spawnSpot, options) {
    var date, _ref, _ref10, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9;
    this.name = name;
    if (options == null) options = {};
    date = new Date;
    this.id = crypto.createHash('sha1').update("" + this.name).update("" + spawnSpot.name).update('b9889216daa1ccab').update("" + (date.getTime())).update("" + (date.getMilliseconds())).digest('hex');
    this.lv = (_ref = options.lv) != null ? _ref : 1;
    this.atk = (_ref2 = options.atk) != null ? _ref2 : 1;
    this.matk = (_ref3 = options.matk) != null ? _ref3 : 1;
    this.hp = (_ref4 = options.hp) != null ? _ref4 : 10;
    this.mp = (_ref5 = options.mp) != null ? _ref5 : 10;
    this.brave = (_ref6 = options.brave) != null ? _ref6 : 50;
    this.faith = (_ref7 = options.faith) != null ? _ref7 : 50;
    this.speed = (_ref8 = options.speed) != null ? _ref8 : 3;
    this.gold = (_ref9 = options.gold) != null ? _ref9 : 300;
    this.items = (_ref10 = options.items) != null ? _ref10 : [];
    this.action = null;
    this.actionProcess = 0.0;
    this.spot = spawnSpot;
    this.destination = spawnSpot;
  }

  Brave.prototype.tick = function() {
    var prevAction, result;
    if (this.action != null) {
      this.actionProcess += this.action.time > 0 ? this.speed / this.action.time : 1.0;
      if (this.actionProcess >= 1.0) {
        prevAction = this.action;
        result = this.action["do"](this);
        return this.emit('completeAction', this, prevAction, result);
      }
    }
  };

  Brave.prototype.addItem = function(item) {
    if (this.items.length < 10) {
      this.items.push(item);
      return true;
    } else {
      return false;
    }
  };

  Brave.prototype.removeItem = function(item) {
    var i;
    return this.items = (function() {
      var _i, _len, _ref, _results;
      _ref = this.items;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        i = _ref[_i];
        if (i !== item) _results.push(i);
      }
      return _results;
    }).call(this);
  };

  return Brave;

})(EventEmitter);

exports.Brave = Brave;
