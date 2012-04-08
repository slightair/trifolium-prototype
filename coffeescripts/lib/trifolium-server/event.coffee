{ItemCreator} = require './item'

class Event
    constructor: (@brave, @time = 0) ->
        @type = 'unknown'

class SearchEvent extends Event
    constructor: (brave, time, @treasureList = []) ->
        super brave, time
        @type = 'search'

SearchEventProcess = (job, done) ->
    probabilityMax = 1000
    event = job.data
    
    total = 0
    total += info.probability for info in event.treasureList
    
    if total > probabilityMax
        result = {isSucceed: false, treasure: null}
        # save
        done()
        return result
    
    treasureList = event.treasureList.sort (a, b) -> 0.5 - Math.random()
    probability = 0
    probabilities = (probability += info.probability for info in treasureList)
    
    needle = Math.random() * probabilityMax
    treasureInfo = info for info, i in treasureList when not treasureInfo? and needle < probabilities[i]
    treasure = ItemCreator.create(treasureInfo.itemId, treasureInfo.name) if treasureInfo
    
    if treasure && event.brave.addItem treasure
        result = {isSucceed: true, treasure:treasure}
        # save
        done()
        return result
    else
        result = {isSucceed: false, treasure:treasure}
        # save
        done()
        return result

exports.SearchEvent = SearchEvent
exports.SearchEventProcess = SearchEventProcess
