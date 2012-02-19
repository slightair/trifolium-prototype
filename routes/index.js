
exports.index = function(req, res) {
  return res.render("index", {
    title: "World",
    params: {
      Name: 'brave-name',
      Position: 'brave-position',
      Lv: 'brave-lv',
      Attack: 'brave-atk',
      MagicAttack: 'brave-matk',
      HP: 'brave-hp',
      MP: 'brave-mp',
      Brave: 'brave-brave',
      Faith: 'brave-faith',
      Speed: 'brave-speed',
      Action: 'brave-action'
    }
  });
};
