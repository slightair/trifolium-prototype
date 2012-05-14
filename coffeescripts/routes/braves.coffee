{Brave} = require '../lib/trifolium-server/brave'

exports.index = (req, res) ->
    Brave.find({}).desc('id').exec (err, braves) ->
        console.log err.message if err
        
        res.render 'braves',
            title: '勇者の一覧'
            braves: braves
            navbarActiveItem: 'braves'

exports.show = (req, res) ->
    Brave.findOne({hash: req.params.hash}).exec (err, brave) ->
        console.log err.message if err
        
        if brave
            res.render 'brave',
                title: "勇者のステータス - #{brave.name}"
                brave: brave
                navbarActiveItem: 'braves'
        else
            res.render 'error',
                title: '勇者のステータス'
                message: '指定された勇者は見つかりませんでした'
                navbarActiveItem: 'braves'

