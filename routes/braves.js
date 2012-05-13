var Brave;

Brave = require('../lib/trifolium-server/brave').Brave;

exports.index = function(req, res) {
  return Brave.find({}).desc('id').exec(function(err, braves) {
    if (err) console.log(err.message);
    return res.render("braves", {
      title: "勇者の一覧",
      braves: braves
    });
  });
};

exports.show = function(req, res) {
  return Brave.findOne({
    hash: req.params.hash
  }).exec(function(err, brave) {
    if (err) console.log(err.message);
    if (brave) {
      return res.render("brave", {
        title: "勇者のステータス - " + brave.name,
        brave: brave
      });
    } else {
      return res.render("error", {
        title: "勇者のステータス",
        message: "指定された勇者は見つかりませんでした"
      });
    }
  });
};
