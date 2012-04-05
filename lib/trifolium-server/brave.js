var Brave, BraveCreator, EventEmitter, crypto,
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

crypto = require('crypto');

EventEmitter = require('events').EventEmitter;

Brave = (function(_super) {

  __extends(Brave, _super);

  function Brave(name, options) {
    var date, _ref, _ref10, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9;
    this.name = name;
    if (options == null) options = {};
    date = new Date;
    this.id = crypto.createHash('sha1').update("" + this.name).update('b9889216daa1ccab').update("" + (date.getTime())).update("" + (date.getMilliseconds())).digest('hex');
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
  }

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

  Brave.prototype.details = function() {
    var item;
    return {
      id: this.id,
      name: this.name,
      lv: this.lv,
      atk: this.atk,
      matk: this.matk,
      hp: this.hp,
      mp: this.mp,
      brave: this.brave,
      faith: this.faith,
      speed: this.speed,
      gold: this.gold,
      items: (function() {
        var _i, _len, _ref, _results;
        _ref = this.items;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          item = _ref[_i];
          _results.push(item.details());
        }
        return _results;
      }).call(this)
    };
  };

  return Brave;

})(EventEmitter);

BraveCreator = (function() {

  function BraveCreator() {
    this.braveNamePrefixes = [];
    this.braveNameSuffixes = [];
  }

  BraveCreator.prototype.setBraveNameDict = function(braveNameDict) {
    var braveNamePrefixes, braveNameSuffixes, dict, term, _i, _j, _k, _l, _len, _len2, _len3, _len4, _ref, _ref2;
    braveNamePrefixes = [];
    braveNameSuffixes = [];
    _ref = [braveNameDict.prefixes, braveNameDict.terms];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      dict = _ref[_i];
      for (_j = 0, _len2 = dict.length; _j < _len2; _j++) {
        term = dict[_j];
        braveNamePrefixes.push(term);
      }
    }
    _ref2 = [braveNameDict.suffixes, braveNameDict.terms];
    for (_k = 0, _len3 = _ref2.length; _k < _len3; _k++) {
      dict = _ref2[_k];
      for (_l = 0, _len4 = dict.length; _l < _len4; _l++) {
        term = dict[_l];
        braveNameSuffixes.push(term);
      }
    }
    this.braveNamePrefixes = braveNamePrefixes;
    return this.braveNameSuffixes = braveNameSuffixes;
  };

  BraveCreator.prototype.create = function(options) {
    if (options == null) options = {};
    return new Brave(this.makeBraveName(), options);
  };

  BraveCreator.prototype.makeBraveName = function() {
    var prefixIndex, suffixIndex;
    prefixIndex = parseInt(Math.random() * this.braveNamePrefixes.length);
    suffixIndex = parseInt(Math.random() * this.braveNameSuffixes.length);
    return "" + this.braveNamePrefixes[prefixIndex] + this.braveNameSuffixes[suffixIndex];
  };

  return BraveCreator;

})();

exports.Brave = Brave;

exports.BraveCreator = new BraveCreator;
