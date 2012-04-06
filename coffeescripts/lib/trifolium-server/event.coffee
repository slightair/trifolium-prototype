

class Event
    constructor: (@brave, @time = 0) ->
        @type = 'unknown'
    process: ->
        # do nothing.

class SearchEvent extends Event
    probabilityMax: 1000
    
    constructor: (brave, time, @treasureDict = {}) ->
        super brave, time
        @type = 'search'
    process: ->
        total = 0
        total += treasureInfo.probability for id, treasureInfo of @treasureDict
        if total > @probabilityMax
            return {isSucceed: false, treasure: null}
        
        treasureIds = (id for id, treasureInfo of @treasureDict).sort (a, b) -> 0.5 - Math.random()
        probability = 0
        probabilities = (probability += @treasureDict[id].probability for id in treasureIds)
        
        needle = Math.random() * @probabilityMax
        treasure = @treasureDict[id].item for id, i in treasureIds when not treasure? and needle < probabilities[i]
        
        if treasure && @brave.addItem treasure
            {isSucceed: true, treasure:treasure}
        else
            {isSucceed: false, treasure:treasure}
    save: (result) ->
        #
EventProcess = (job, done) ->
    event = job.data
    result = event.process()
    event.save(result)
    
    done()

exports.SearchEvent = SearchEvent
exports.EventProcess = EventProcess
