{EventLog} = require '../lib/trifolium-server/event'

exports.index = (req, res) ->
    res.render "index",
        title: "World"

exports.history = (req, res) ->
    EventLog.find({}).desc('date').exec (err, logs) ->
        console.log err.message if err
        
        res.render 'history',
            title: 'イベント履歴'
            logs: logs
            navbarActiveItem: 'history'