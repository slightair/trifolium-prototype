class Receiver
    constructor: (options) ->
        @mode = options.mode
        
        switch @mode
            when 'pusher'
                1
            when 'socket.io'
                io = require('socket.io-client') if require?
                @socket = io.connect options.host
            else
                console.log 'receiver do nothing.'
        
    bind: (command, callback) ->
        @socket?.on command, callback
        @

exports?.Receiver = Receiver