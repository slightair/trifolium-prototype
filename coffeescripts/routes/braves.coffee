{Brave} = require '../lib/trifolium-server/brave'

exports.index = (req, res) ->
    Brave.find({}).desc('id').exec (err, braves) ->
        console.log err.message if err
        
        res.render "braves",
            title: "勇者の一覧"
            braves: braves
