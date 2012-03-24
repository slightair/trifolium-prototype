{EventEmitter} = require 'events'

class Notifier extends EventEmitter
    constructor: (@server, options) ->
        @mode = options?.mode
        
        switch @mode
            when 'pusher'
                Pusher = require 'node-pusher'
                @pusher = new Pusher
                    appId: options.pusherAppId
                    key: options.pusherTokenKey
                    secret: options.pusherTokenSecret
            
            when 'socket.io'
                @socketIo = require('socket.io').listen @server
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