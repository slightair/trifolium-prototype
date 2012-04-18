step = (callbacks, done) ->
    counter = callbacks.length
    next = ->
        counter -= 1
        done() if counter == 0
    callback(next) for callback in callbacks

exports.step = step