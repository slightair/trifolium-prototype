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

compile_server = (callback) ->
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

build_server = (callback) ->
    compile_lib -> compile_settings -> compile_server -> callback?()

compile_client_console = (callback) ->
    options = [
        '-c'
        '-o'
        '.'
        'coffeescripts/game-client-console.coffee'
    ]
    coffee = spawn "#{bin_path}/coffee", options
    coffee.stdout.on 'data', stream_data_handler
    coffee.stderr.on 'data', stream_data_handler
    coffee.on 'exit', (status) -> callback?() if status is 0

build_client_console = (callback) ->
    compile_lib -> compile_settings -> compile_client_console -> callback?()

# compile_client_browser = (callback) ->
#     options = [
#         '-b'
#         '-c'
#         '-j'
#         'game.js'
#         'coffeescripts/lib/trifolium-client/'
#         'coffeescripts/settings.coffee'
#         'coffeescripts/game-client-browser.coffee'
#     ]
#     coffee = spawn "#{bin_path}/coffee", options
#     coffee.stdout.on 'data', stream_data_handler
#     coffee.stderr.on 'data', stream_data_handler
#     coffee.on 'exit', (status) -> callback?() if status is 0
# 
# minify_client_browser = (callback) ->
#     options = [
#             '-o'
#             'public/javascripts/game.min.js'
#             'game.js'
#     ]
#     uglify = spawn "#{bin_path}/uglifyjs", options
#     uglify.stdout.on 'data', stream_data_handler
#     uglify.stderr.on 'data', stream_data_handler
#     uglify.on 'exit', (status) -> callback?() if status is 0
# 
# build_client_browser = (callback) ->
#     compile_client_browser -> minify_client_browser -> callback?()

compile_server_test = (callback) ->
    options = [
        '-b'
        '-c'
        '-o'
        'test/lib/trifolium-server'
        'coffeescripts/test/lib/trifolium-server/'
    ]
    coffee = spawn "#{bin_path}/coffee", options
    coffee.stdout.on 'data', stream_data_handler
    coffee.stderr.on 'data', stream_data_handler
    coffee.on 'exit', (status) -> callback?() if status is 0

compile_client_test = (callback) ->
    options = [
        '-b'
        '-c'
        '-o'
        'test/lib/trifolium-client'
        'coffeescripts/test/lib/trifolium-client/'
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
        'test/lib/trifolium-server/action-test.js'
        'test/lib/trifolium-server/brave-test.js'
        'test/lib/trifolium-server/item-test.js'
        'test/lib/trifolium-server/spot-test.js'
    ]
    mocha = spawn "#{bin_path}/mocha", options
    output = ''
    data_handler = (data) ->
        output =+ data if data
        stream_data_handler data
    mocha.stdout.on 'data', data_handler
    mocha.stderr.on 'data', data_handler
    mocha.on 'exit', (status) -> callback?() if status is 0

task 'server', 'make game-server.js', ->
    build_server -> 'All done.'

task 'console', 'make game-client-console.js', ->
    build_client_console -> 'All done.'

# task 'browser', 'make game-client-browser.js', (options) ->
#     build_client_browser -> 'All done.'

task 'test', 'run test', (options) ->
    compile_lib -> compile_settings -> compile_server_test -> compile_client_test -> run_test -> 'All done.'

# task 'all', 'compile all scripts', ->
#     build_server -> build_client_console -> build_client_browser -> compile_server_test -> compile_client_test -> 'All done.'