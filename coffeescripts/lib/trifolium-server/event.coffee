{ItemCreator} = require './item'

class SearchEvent
    probabilityMax: 1000
    constructor: (@treasureList = []) ->
        @type = 'search'
    
    process: (brave) ->
        total = 0
        total += info.probability for info in @treasureList
        
        if total > @probabilityMax
            result = {isSucceed: false, treasure: null}
            @save result
            return result
        
        treasureList = @treasureList.sort (a, b) -> 0.5 - Math.random()
        probability = 0
        probabilities = (probability += info.probability for info in treasureList)
        
        needle = Math.random() * @probabilityMax
        treasureInfo = info for info, i in treasureList when not treasureInfo? and needle < probabilities[i]
        treasure = ItemCreator.create(treasureInfo.itemId, treasureInfo.name) if treasureInfo
        
        if treasure && brave.addItem treasure
            result = {isSucceed: true, treasure:treasure}
            @save result
        else
            result = {isSucceed: false, treasure:treasure}
            @save result
        result
    save: (result) ->
        #

exports.SearchEvent = SearchEvent
