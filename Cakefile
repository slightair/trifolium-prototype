fs            = require 'fs'
{spawn, exec} = require 'child_process'

stream_data_handler = (data) -> console.log data.toString()

compile_lib = (callback) ->
    options = [
        '-b'
        '-c'
        '-o'
        'lib'
        'coffeescripts/lib/'
    ]
    coffee = spawn 'coffee', options
    coffee.stdout.on 'data', stream_data_handler
    coffee.stderr.on 'data', stream_data_handler
    coffee.on 'exit', (status) -> callback?() if status is 0

compile_settings = (callback) ->
    options = [
        '-b'
        '-c'
        '-o'
        '.'
        'coffeescripts/settings.coffee'
    ]
    coffee = spawn 'coffee', options
    coffee.stdout.on 'data', stream_data_handler
    coffee.stderr.on 'data', stream_data_handler
    coffee.on 'exit', (status) -> callback?() if status is 0

compile_console_app = (callback) ->
    options = [
        '-c'
        '-o'
        '.'
        'coffeescripts/console-app.coffee'
    ]
    coffee = spawn 'coffee', options
    coffee.stdout.on 'data', stream_data_handler
    coffee.stderr.on 'data', stream_data_handler
    coffee.on 'exit', (status) -> callback?() if status is 0

build_console_app = (callback) ->
    compile_lib -> compile_settings -> compile_console_app -> callback?()

compile_game = (callback) ->
    options = [
        '-b'
        '-c'
        '-j'
        'public/javascripts/game.js'
        'coffeescripts/lib/'
        'coffeescripts/settings.coffee'
        'coffeescripts/game.coffee'
    ]
    coffee = spawn 'coffee', options
    coffee.stdout.on 'data', stream_data_handler
    coffee.stderr.on 'data', stream_data_handler
    coffee.on 'exit', (status) -> callback?() if status is 0

minify_game = (callback) ->
    callback?()
    
build_game = (callback) ->
    compile_game -> minify_game -> callback?()

compile_test = (callback) ->
    options = [
        '-b'
        '-c'
        '-o'
        'test'
        'coffeescripts/test/'
    ]
    coffee = spawn 'coffee', options
    coffee.stdout.on 'data', stream_data_handler
    coffee.stderr.on 'data', stream_data_handler
    coffee.on 'exit', (status) -> callback?() if status is 0

run_test = (callback) ->
    options = [
        '--spec'
    ]
    vows = spawn 'vows', options
    output = ''
    data_handler = (data) ->
        output =+ data if data
        stream_data_handler data
    vows.stdout.on 'data', data_handler
    vows.stderr.on 'data', data_handler
    vows.on 'exit', (status) ->
        if 0 isnt status or (output and -1 isnt output.indexOf("✗ Broken"))
            return process.exit 1
        callback?()

task 'console', 'make console-app.js', ->
    build_console_app -> 'All done.'

task 'game', 'make game.js for web browser', (options) ->
    build_game -> 'All done.'

task 'test', 'run test', (options) ->
    compile_lib -> compile_test -> run_test -> 'All done.'
