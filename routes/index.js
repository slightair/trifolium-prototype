var EventLog;

EventLog = require('../lib/trifolium-server/event').EventLog;

exports.index = function(req, res) {
  return res.render("index", {
    title: "World",
    params: {
      Name: 'brave-name',
      Location: 'brave-location',
      Lv: 'brave-lv',
      Attack: 'brave-atk',
      MagicAttack: 'brave-matk',
      HP: 'brave-hp',
      MP: 'brave-mp',
      Brave: 'brave-brave',
      Faith: 'brave-faith',
      Speed: 'brave-speed',
      Action: 'brave-action'
    },
    script: "var gameConfig={width:580,height:450,trifolium:{websocket:" + websocketConfig + "},gameServerHost:'" + settings.gameServerHost + "'};"
  });
};

exports.history = function(req, res) {
  return EventLog.find({}, function(err, logs) {
    if (err) console.log(err.message);
    return res.render("history", {
      title: "イベント履歴",
      logs: logs
    });
  });
};
