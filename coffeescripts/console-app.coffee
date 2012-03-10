{Trifolium} = require('./lib/trifolium')
{settings} = require('./settings')
io = require('socket.io-client')

socket = io.connect 'http://localhost:6262'
socket.on 'eventlog', (log) ->
    console.log log
