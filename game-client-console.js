(function() {
  var Trifolium, trifolium;

  Trifolium = require('./lib/trifolium-client/trifolium').Trifolium;

  trifolium = new Trifolium({
    websocket: {
      mode: 'socket.io',
      host: 'http://localhost:6262'
    }
  });

  trifolium.on('braveCompleteAction', function(brave, action, result) {
    var arrivalSpot;
    switch (action.name) {
      case 'move':
        arrivalSpot = trifolium.spotForId(action.optionalInfo.to);
        return console.log("勇者" + brave.name + " が " + arrivalSpot.name + " に到着しました");
      case 'wait':
        return console.log("勇者" + brave.name + " はぼーっとしていた");
      case 'search':
        if (result.isSucceed) {
          return console.log("勇者" + brave.name + " は " + result.treasure.name + " を手に入れた!");
        } else {
          if (result.treasure) {
            return console.log("勇者" + brave.name + " は " + result.treasure.name + " を見つけたが、これ以上アイテムを持てないのであきらめた…");
          } else {
            return console.log("勇者" + brave.name + " はアイテムを見つけられなかった…");
          }
        }
        break;
      default:
        return console.log('eventlog', "unknown event - " + action.name);
    }
  });

  setInterval(function() {}, 10000000);

}).call(this);
