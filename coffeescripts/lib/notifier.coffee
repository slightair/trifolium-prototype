class Notifier
    constructor: ->
        server = require('http').createServer (req, res) ->
            res.writeHead 200,
                'Content-Type': 'text/plain'
            res.end 'Trifolium game server is running.\n'
        @io = require('socket.io').listen server
        server.listen 6262
        @io.sockets.on 'connection', (socket) ->
            # initialize
    
    notify: (command, data) ->
        @io.sockets.emit command, data

exports.Notifier = Notifier