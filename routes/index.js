
exports.index = function(req, res) {
  return res.render("index", {
    title: "trifolium",
    params: {
      Name: 'brave-name',
      Lv: 'brave-lv',
      Attack: 'brave-atk',
      MagicAttack: 'brave-matk',
      HP: 'brave-hp',
      MP: 'brave-mp',
      Brave: 'brave-brave',
      Faith: 'brave-faith',
      Speed: 'brave-speed',
      Action: 'brave-action',
      ActionProcess: 'brave-actionProcess'
    }
  });
};
