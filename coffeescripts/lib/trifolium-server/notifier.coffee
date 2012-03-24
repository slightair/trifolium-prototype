{EventEmitter} = require 'events'
Pusher = require 'node-pusher'

class Notifier extends EventEmitter
    constructor: (options) ->
        @mode = options?.mode
        
        switch @mode
            when 'pusher'
                @pusher = new Pusher
                    appId: options.pusherAppId
                    key: options.pusherTokenKey
                    secret: options.pusherTokenSecret
                
            when 'socket.io'
                server = require('http').createServer (req, res) ->
                    res.writeHead 200,
                        'Content-Type': 'text/plain'
                    res.end 'Trifolium game server is running.\n'
                @socketIo = require('socket.io').listen server
                server.listen options.port
                @socketIo.sockets.on 'connection', (socket) =>
                    @emit 'connection', {notify: (command, data) -> socket.emit command, data}
            
            else
                console.log 'notifier do nothing.'
    
    notify: (command, data) ->
        switch @mode
            when 'pusher'
                @pusher.trigger 'trifolium', command, data
            when 'socket.io'
                @socketIo.sockets.emit command, data
            else
                console.log "send #{command}: #{data}"

exports.Notifier = Notifier