{exec} = require 'child_process'

files = [
    'coffeescripts/engine/settings.coffee'
    'coffeescripts/engine/brave.coffee',
    'coffeescripts/engine/action.coffee'
    'coffeescripts/engine/spot.coffee'
    'coffeescripts/engine/simulator.coffee'
]

main4nodejs_coffee = 'coffeescripts/console-app.coffee'
main4nodejs_output= 'console-app.js'

main4browser_coffee = 'coffeescripts/game.coffee'
main4browser_output= 'public/javascripts/game.js'

task 'console-app', 'make console-app.js for console', (options) ->
    exec "coffee -b -c -j #{main4nodejs_output} #{files.join ' '} #{main4nodejs_coffee}", (error, stdout, stderr) ->
        throw error if error
        console.log(stdout + stderr)

task 'app', 'make app.js and game.js for web', (options) ->
    exec "coffee -c app.coffee"
    exec "coffee -b -c -j #{main4browser_output} #{files.join ' '} #{main4browser_coffee}", (error, stdout, stderr) ->
        throw error if error
        console.log(stdout + stderr)

task 'test', 'run test', (options) ->
    console.log "mada desu."
