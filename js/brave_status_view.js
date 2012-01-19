var BraveList, BraveStatusView,
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

BraveList = (function(_super) {

  __extends(BraveList, _super);

  function BraveList() {
    BraveList.__super__.constructor.apply(this, arguments);
  }

  BraveList.prototype.model = Brave;

  return BraveList;

})(Backbone.Collection);

BraveStatusView = (function(_super) {

  __extends(BraveStatusView, _super);

  function BraveStatusView() {
    this.braveList = new BraveList([new Brave]);
    this.render();
  }

  BraveStatusView.prototype.render = function() {};

  return BraveStatusView;

})(Backbone.View);
