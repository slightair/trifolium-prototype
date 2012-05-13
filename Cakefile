{spawn, exec} = require 'child_process'
util = require 'util'
fs = require 'fs'

bin_path = './node_modules/.bin'
stream_data_handler = (data) -> util.print data.toString()

compile_app = (callback) ->
    options = [
        '-b'
        '-c'
        '-o'
        '.'
        'coffeescripts/app.coffee'
    ]
    coffee = spawn "#{bin_path}/coffee", options
    coffee.stdout.on 'data', stream_data_handler
    coffee.stderr.on 'data', stream_data_handler
    coffee.on 'exit', (status) -> callback?() if status is 0

compile_route = (callback) ->
    options = [
        '-b'
        '-c'
        '-o'
        'routes'
        'coffeescripts/routes/'
    ]
    coffee = spawn "#{bin_path}/coffee", options
    coffee.stdout.on 'data', stream_data_handler
    coffee.stderr.on 'data', stream_data_handler
    coffee.on 'exit', (status) -> callback?() if status is 0

build_express = (callback) ->
    compile_lib -> compile_app -> compile_route -> callback?()

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
    compile_lib -> compile_server -> callback?()

compile_client_browser = (callback) ->
    options = [
        '-b'
        '-c'
        '-j'
        './tmp/game.js'
        'coffeescripts/lib/trifolium-client/'
        'coffeescripts/game-client-browser.coffee'
    ]
    coffee = spawn "#{bin_path}/coffee", options
    coffee.stdout.on 'data', stream_data_handler
    coffee.stderr.on 'data', stream_data_handler
    coffee.on 'exit', (status) -> callback?() if status is 0

minify_client_browser = (callback) ->
    options = [
            '-o'
            'public/javascripts/game.min.js'
            'tmp/game.js'
    ]
    uglify = spawn "#{bin_path}/uglifyjs", options
    uglify.stdout.on 'data', stream_data_handler
    uglify.stderr.on 'data', stream_data_handler
    uglify.on 'exit', (status) -> callback?() if status is 0

build_client_browser = (callback) ->
    compile_client_browser -> minify_client_browser -> callback?()

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
        'test/lib/trifolium-server/brave-test.js'
        'test/lib/trifolium-server/item-test.js'
        'test/lib/trifolium-server/dungeon-test.js'
        'test/lib/trifolium-server/event-test.js'
        'test/lib/trifolium-server/simulator-test.js'
        # 'test/lib/trifolium-client/braveInfo-test.js'
        # 'test/lib/trifolium-client/itemInfo-test.js'
    ]
    mocha = spawn "#{bin_path}/mocha", options
    output = ''
    data_handler = (data) ->
        output =+ data if data
        stream_data_handler data
    mocha.stdout.on 'data', data_handler
    mocha.stderr.on 'data', data_handler
    mocha.on 'exit', (status) -> callback?() if status is 0

remove_coverage = (callback) ->
    exec "rm -fr ./lib-cov"
    callback?()

make_coverage = (callback) ->
    options = [
        './lib'
        './lib-cov'
    ]
    jscoverage = spawn "jscoverage", options
    jscoverage.stdout.on 'data', stream_data_handler
    jscoverage.stderr.on 'data', stream_data_handler
    jscoverage.on 'exit', (status) -> callback?() if status is 0

run_coverage = (callback) ->
    process.env['TRIFOLIUM_COV'] = 1
    options = [
        '-R'
        'html-cov'
        '-c'
        'test/lib/trifolium-server/brave-test.js'
        'test/lib/trifolium-server/item-test.js'
        'test/lib/trifolium-server/dungeon-test.js'
        'test/lib/trifolium-server/event-test.js'
        'test/lib/trifolium-server/simulator-test.js'
    ]
    mocha = spawn "#{bin_path}/mocha", options
    
    fileStream = fs.createWriteStream 'coverage.html'
    output = ''
    data_handler = (data) ->
        output =+ data if data
        fileStream.write data
    mocha.stdout.on 'data', data_handler
    mocha.stderr.on 'data', data_handler
    mocha.on 'exit', (status) -> callback?() if status is 0

open_coverage = (callback) ->
    exec 'open coverage.html'
    callback?()

task 'express', 'make express files', ->
    build_express -> 'All done.'

task 'server', 'make game-server.js', ->
    build_server -> 'All done.'

task 'browser', 'make game-client-browser.js', ->
    build_client_browser -> 'All done.'

task 'test', 'run test', ->
    compile_lib -> compile_server_test -> run_test -> 'All done.'

task 'coverage', 'run coverage', ->
    compile_lib -> compile_server_test -> remove_coverage -> make_coverage -> run_coverage -> open_coverage -> 'All done.'

task 'all', 'compile all scripts', ->
    # build_server -> build_express -> compile_server_test -> compile_client_test -> 'All done.'
    build_server -> compile_server_test -> 'All done.'