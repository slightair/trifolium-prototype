step = (callbacks, done) ->
    counter = callbacks.length
    next = ->
        counter -= 1
        done() if counter == 0
    callback(next) for callback in callbacks

exports.step = step

zeroPadding = (val, width) ->
    valWidth = val.toString().length
    if valWidth < width
        "#{Array(width - valWidth + 1).join('0')}#{val}"
    else
        val.toString()

gamedate = (time) ->
    unixTime = time.getTime() / 1000
    gameTime = unixTime - 1325376000 # 2012-01-01 09:00:00 +0900 origin
    
    gameHours = 30 # 30秒で1時間
    gameDay   = 24 * gameHours
    gameMonth = 30 * gameDay
    gameYear  = 12 * gameMonth
    
    year    = zeroPadding(Math.floor(gameTime / gameYear), 4)
    month   = zeroPadding(Math.floor((gameTime % gameYear)  / gameMonth), 2)
    day     = zeroPadding(Math.floor((gameTime % gameMonth) / gameDay), 2)
    hours   = zeroPadding(Math.floor((gameTime % gameDay)   / gameHours), 2)
    minutes = zeroPadding(Math.floor((gameTime % gameHours) / (gameHours / 60)), 2)
    
    "#{year}年#{month}月#{day}日 #{hours}:#{minutes} (#{time.getHours()}:#{time.getMinutes()}:#{time.getSeconds()})"

exports.gamedate = gamedate