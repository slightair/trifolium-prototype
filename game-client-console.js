(function() {
  var Trifolium, config, trifolium;

  config = {
    websocketOptions: {
      mode: 'socket.io',
      host: 'http://localhost:6262'
    }
  };

  Trifolium = require('./lib/trifolium-client/trifolium').Trifolium;

  trifolium = new Trifolium(config);

}).call(this);
