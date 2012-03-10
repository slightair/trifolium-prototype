{spawn} = require 'child_process'
util = require 'util'

bin_path = './node_modules/.bin'
stream_data_handler = (data) -> util.print data.toString()

compile_lib = (callback) ->
    options = [
        '-b'
        '-c'
        '-o'
        'lib'
        'coffeescripts/lib/'
    ]
    coffee = spawn "#{bin_path}/coffee", options
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
    coffee = spawn "#{bin_path}/coffee", options
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
    coffee = spawn "#{bin_path}/coffee", options
    coffee.stdout.on 'data', stream_data_handler
    coffee.stderr.on 'data', stream_data_handler
    coffee.on 'exit', (status) -> callback?() if status is 0

build_console_app = (callback) ->
    compile_lib -> compile_settings -> compile_console_app -> callback?()

compile_server_app = (callback) ->
    options = [
        '-c'
        '-o'
        '.'
        'coffeescripts/game-server.coffee'
    ]
    coffee = spawn "#{bin_path}/coffee", options
    coffee.stdout.on 'data', stream_data_handler
    coffee.stderr.on 'data', stream_data_handler
    coffee.on 'exit', (status) -> callback?() if status is 0

build_server_app = (callback) ->
    compile_lib -> compile_settings -> compile_server_app -> callback?()

compile_game = (callback) ->
    options = [
        '-b'
        '-c'
        '-j'
        'game.js'
        'coffeescripts/lib/trifolium/'
        'coffeescripts/lib/trifolium.coffee'
        'coffeescripts/settings.coffee'
        'coffeescripts/game.coffee'
    ]
    coffee = spawn "#{bin_path}/coffee", options
    coffee.stdout.on 'data', stream_data_handler
    coffee.stderr.on 'data', stream_data_handler
    coffee.on 'exit', (status) -> callback?() if status is 0

minify_game = (callback) ->
    options = [
            '-o'
            'public/javascripts/game.min.js'
            'game.js'
    ]
    uglify = spawn "#{bin_path}/uglifyjs", options
    uglify.stdout.on 'data', stream_data_handler
    uglify.stderr.on 'data', stream_data_handler
    uglify.on 'exit', (status) -> callback?() if status is 0

build_game = (callback) ->
    compile_game -> minify_game -> callback?()

compile_test = (callback) ->
    options = [
        '-b'
        '-c'
        '-o'
        'test'
        'coffeescripts/test/lib/trifolium/'
    ]
    coffee = spawn "#{bin_path}/coffee", options
    coffee.stdout.on 'data', stream_data_handler
    coffee.stderr.on 'data', stream_data_handler
    coffee.on 'exit', (status) -> callback?() if status is 0

run_test = (callback) ->
    options = [
        '-r'
        'should'
        '-R'
        'spec'
        '-c'
    ]
    mocha = spawn "#{bin_path}/mocha", options
    output = ''
    data_handler = (data) ->
        output =+ data if data
        stream_data_handler data
    mocha.stdout.on 'data', data_handler
    mocha.stderr.on 'data', data_handler
    mocha.on 'exit', (status) -> callback?() if status is 0

task 'console', 'make console-app.js', ->
    build_console_app -> 'All done.'

task 'server', 'make game-server.js', ->
    build_server_app -> 'All done.'

task 'game', 'make game.js for web browser', (options) ->
    build_game -> 'All done.'

task 'test', 'run test', (options) ->
    compile_lib -> compile_settings -> compile_test -> run_test -> 'All done.'

task 'all', 'compile all scripts', ->
    build_server_app -> build_console_app -> build_game -> compile_test -> 'All done.'