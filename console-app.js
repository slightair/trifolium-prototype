(function() {
  var Trifolium, brave, settings, simulator, _i, _len, _ref;

  Trifolium = require('./lib/trifolium').Trifolium;

  settings = require('./settings').settings;

  simulator = new Trifolium(settings);

  _ref = simulator.braveList;
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    brave = _ref[_i];
    brave.onCompleteAction = function(brave, action, isSucceed) {
      switch (action.name) {
        case 'move':
          return console.log("" + brave.name + " is arrived at " + action.to.name);
        case 'wait':
          return console.log("" + brave.name + " is waiting...");
      }
    };
  }

  simulator.start();

}).call(this);
