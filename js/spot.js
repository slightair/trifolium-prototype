var Spot;

Spot = (function() {

  function Spot(posX, posY, actions) {
    this.posX = posX;
    this.posY = posY;
    this.actions = actions;
  }

  Spot.prototype.distance = function(aSpot) {
    return Math.sqrt(Math.pow(this.posX - aSpot.posX) + Math.pow(this.posY - aSpot.posY));
  };

  return Spot;

})();
