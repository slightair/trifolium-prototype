var Brave, BraveCreator, BraveSchema, Schema, crypto, mongoose, step;

crypto = require('crypto');

mongoose = require('mongoose');

Schema = mongoose.Schema;

step = require('../util').step;

BraveSchema = new Schema({
  name: String,
  level: Number,
  attack: Number,
  magic: Number,
  maxhp: Number,
  hp: Number,
  maxmp: Number,
  mp: Number,
  brave: Number,
  faith: Number,
  speed: Number,
  gold: Number,
  items: [
    {
      name: String,
      itemId: Number,
      hash: String
    }
  ],
  hash: String
});

BraveSchema.methods.addItem = function(item) {
  if (this.items.length < 10) {
    this.items.push(item);
    this.save(function(err) {
      if (err) return console.log(err.message);
    });
    return true;
  } else {
    return false;
  }
};

BraveSchema.methods.removeItem = function(item) {
  var i;
  this.items = (function() {
    var _i, _len, _ref, _results;
    _ref = this.items;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      i = _ref[_i];
      if (i !== item) _results.push(i);
    }
    return _results;
  }).call(this);
  this.save(function(err) {
    if (err) return console.log(err.message);
  });
  return this.items;
};

exports.BraveSchema = BraveSchema;

Brave = mongoose.model('Brave', BraveSchema);

exports.Brave = Brave;

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

  BraveCreator.prototype.create = function(info, next) {
    return this.createBraves([info](next));
  };

  BraveCreator.prototype.createBraves = function(infoList, next) {
    var braves, info, saveBrave, saveBraveFunctions, _i, _len,
      _this = this;
    saveBraveFunctions = [];
    braves = [];
    saveBrave = function(info) {
      var brave, _ref, _ref10, _ref11, _ref12, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9;
      brave = new Brave;
      brave.name = _this.makeBraveName();
      brave.level = (_ref = info.level) != null ? _ref : 1;
      brave.attack = (_ref2 = info.attack) != null ? _ref2 : 1;
      brave.magic = (_ref3 = info.magic) != null ? _ref3 : 1;
      brave.maxhp = (_ref4 = info.maxhp) != null ? _ref4 : 10;
      brave.hp = (_ref5 = info.maxhp) != null ? _ref5 : 10;
      brave.maxmp = (_ref6 = info.maxmp) != null ? _ref6 : 10;
      brave.mp = (_ref7 = info.maxmp) != null ? _ref7 : 10;
      brave.brave = (_ref8 = info.brave) != null ? _ref8 : 50;
      brave.faith = (_ref9 = info.faith) != null ? _ref9 : 50;
      brave.speed = (_ref10 = info.speed) != null ? _ref10 : 3;
      brave.gold = (_ref11 = info.gold) != null ? _ref11 : 300;
      brave.items = (_ref12 = info.items) != null ? _ref12 : [];
      brave.hash = crypto.createHash('sha1').update(brave.id).update('cf3e3815').digest('hex').substr(0, 12);
      return saveBraveFunctions.push(function(done) {
        return brave.save(function(err) {
          if (err) console.log(err.message);
          braves.push(brave);
          return done();
        });
      });
    };
    for (_i = 0, _len = infoList.length; _i < _len; _i++) {
      info = infoList[_i];
      saveBrave(info);
    }
    return step(saveBraveFunctions, function() {
      return next(braves);
    });
  };

  BraveCreator.prototype.makeBraveName = function() {
    var prefixIndex, suffixIndex;
    prefixIndex = parseInt(Math.random() * this.braveNamePrefixes.length);
    suffixIndex = parseInt(Math.random() * this.braveNameSuffixes.length);
    return "" + this.braveNamePrefixes[prefixIndex] + this.braveNameSuffixes[suffixIndex];
  };

  return BraveCreator;

})();

exports.BraveCreator = new BraveCreator;
