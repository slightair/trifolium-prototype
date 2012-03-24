
exports.index = function(req, res) {
  var settings;
  settings = req.app.settings;
  return res.render("index", {
    title: "World",
    scriptfiles: ['javascripts/lib/bootstrap-tab.js', 'javascripts/lib/cake.js', 'javascripts/game.min.js', 'http://js.pusher.com/1.11/pusher.min.js'],
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
    script: "var trifoliumConfig={websocket:{mode:'pusher',pusherTokenKey:'" + settings.pusherTokenKey + "'}}"
  });
};
