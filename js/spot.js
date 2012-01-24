var Spot;

Spot = (function() {

  function Spot(name, posX, posY) {
    this.name = name;
    this.posX = posX;
    this.posY = posY;
    this.actions = [];
  }

  Spot.prototype.randomAction = function() {
    var index;
    index = Math.floor(Math.random() * this.actions.length);
    return this.actions[index];
  };

  Spot.prototype.distance = function(aSpot) {
    return Math.sqrt(Math.pow(this.posX - aSpot.posX, 2) + Math.pow(this.posY - aSpot.posY, 2));
  };

  return Spot;

})();
