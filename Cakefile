{exec} = require 'child_process'

files = [
    'coffee/settings.coffee'
    'coffee/brave.coffee',
    'coffee/action.coffee'
    'coffee/spot.coffee'
    'coffee/simulator.coffee'
]

main4nodejs_coffee = 'coffee/main.coffee'
main4nodejs_output= 'js/main.js'

main4browser_coffee = 'coffee/game.coffee'
main4browser_output= 'js/game.js'

task 'jsfiles', 'make jsfiles', (options) ->
    exec "coffee -b -o js -c #{files.join ' '}", (error, stdout, stderr) ->
        throw error if error
        console.log(stdout + stderr)

task 'node', 'make main.js for nodejs', (options) ->
    exec "coffee -b -o js -c -j #{main4nodejs_output} #{files.join ' '} #{main4nodejs_coffee}", (error, stdout, stderr) ->
        throw error if error
        console.log(stdout + stderr)

task 'browser', 'make game.js for browser', (options) ->
    exec "coffee -b -o js -c -j #{main4browser_output} #{files.join ' '} #{main4browser_coffee}", (error, stdout, stderr) ->
        throw error if error
        console.log(stdout + stderr)

task 'test', 'run test', (options) ->
    console.log "mada desu."
