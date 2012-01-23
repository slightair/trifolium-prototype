{exec} = require 'child_process'

files = [
    'coffee/brave.coffee',
    'coffee/action.coffee'
    'coffee/spot.coffee'
]

viewfiles = [
    'coffee/brave_status_view.coffee',
]

main4nodejs = 'coffee/main.coffee'
mainfile = 'js/main.js'

task 'jsfiles', 'make jsfiles', (options) ->
    exec "coffee -b -o js -c #{files.join ' '} #{viewfiles.join ' '}", (error, stdout, stderr) ->
        throw error if error
        console.log(stdout + stderr)

task 'main', 'make main.js for nodejs', (options) ->
    exec "coffee -b -o js -c -j #{mainfile} #{files.join ' '} #{main4nodejs}", (error, stdout, stderr) ->
        throw error if error
        console.log(stdout + stderr)

task 'test', 'run test', (options) ->
    console.log "mada desu."
