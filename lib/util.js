var gamedate, step, zeroPadding;

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

zeroPadding = function(val, width) {
  var valWidth;
  valWidth = val.toString().length;
  if (valWidth < width) {
    return "" + (Array(width - valWidth + 1).join('0')) + val;
  } else {
    return val.toString();
  }
};

gamedate = function(time) {
  var day, gameDay, gameMonth, gameTime, gameYear, month, unixTime, year;
  unixTime = time.getTime() / 1000;
  gameTime = unixTime - 1325376000;
  gameDay = 24 * 30;
  gameMonth = 30 * gameDay;
  gameYear = 12 * gameMonth;
  year = zeroPadding(Math.floor(gameTime / gameYear), 4);
  month = zeroPadding(Math.floor((gameTime % gameYear) / gameMonth), 2);
  day = zeroPadding(Math.floor((gameTime % gameMonth) / gameDay), 2);
  return "" + year + "年" + month + "月" + day + "日 (" + (time.getHours()) + ":" + (time.getMinutes()) + ":" + (time.getSeconds()) + ")";
};

exports.gamedate = gamedate;
