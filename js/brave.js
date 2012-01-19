var Brave,
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Brave = (function(_super) {

  __extends(Brave, _super);

  function Brave() {
    this.lv = 1;
    this.atk = 1;
    this.matk = 1;
    this.hp = 10;
    this.mp = 10;
    this.brave = 50;
    this.faith = 50;
    this.speed = 3;
    this.action = null;
  }

  return Brave;

})(Backbone.Model);
