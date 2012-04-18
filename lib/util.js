var step;

step = function(callbacks, done) {
  var callback, counter, next, _i, _len, _results;
  counter = callbacks.length;
  next = function() {
    counter -= 1;
    if (counter === 0) return done();
  };
  _results = [];
  for (_i = 0, _len = callbacks.length; _i < _len; _i++) {
    callback = callbacks[_i];
    _results.push(callback(next));
  }
  return _results;
};

exports.step = step;
