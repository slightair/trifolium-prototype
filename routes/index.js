
exports.index = function(req, res) {
  return res.render("index", {
    title: "Express",
    params: {
      Name: '',
      Lv: '',
      Attack: '',
      MagicAttack: '',
      HP: '',
      MP: '',
      Brave: '',
      Faith: '',
      Speed: '',
      Action: '',
      ActionProcess: ''
    }
  });
};
