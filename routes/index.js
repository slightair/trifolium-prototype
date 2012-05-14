var EventLog;

EventLog = require('../lib/trifolium-server/event').EventLog;

exports.index = function(req, res) {
  return res.render("index", {
    title: "World"
  });
};

exports.history = function(req, res) {
  return EventLog.find({}).desc('date').exec(function(err, logs) {
    if (err) console.log(err.message);
    return res.render('history', {
      title: 'イベント履歴',
      logs: logs,
      navbarActiveItem: 'history'
    });
  });
};
