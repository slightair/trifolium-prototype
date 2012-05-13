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
