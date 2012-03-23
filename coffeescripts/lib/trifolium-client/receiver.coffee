class Receiver
    constructor: (options) ->
        @mode = options?.mode
        
        switch @mode
            when 'pusher'
                1
            when 'socket.io'
                if require?
                    socket_io = require('socket.io-client')
                    @socket = socket_io.connect options.host
                else
                    @socket = io.connect options.host
            else
                console.log 'receiver do nothing.'
        
    bind: (command, callback) ->
        switch @mode
            when 'pusher'
                1
            when 'socket.io'
                @socket?.on command, callback
            else
                console.log "bind #{command}"
        @

exports?.Receiver = Receiver