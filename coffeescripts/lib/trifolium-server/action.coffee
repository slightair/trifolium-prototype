class Action
    constructor: ->
        @name = null
        @time ?= 0
    prepare: (brave) ->
        
    do: (brave) ->
        brave.action = null
        brave.actionProcess = 0.0
        
        # after を呼ばない!　サブクラスにまかせる
        {isSucceed: false}
    after: (brave, nextAction) ->
        nextAction.prepare brave
        brave.action = nextAction
        brave.destination = nextAction.to ? brave.spot
    
    details: ->
        time: 0

class WaitAction extends Action
    constructor: (@time) ->
        super
        @name = 'wait'
    do: (brave) ->
        super brave
        
        @after(brave, brave.spot.randomAction())
        {isSucceed: true}
    details: ->
        time: @time
        name: @name

class MoveAction extends Action
    constructor: (@from, @to) ->
        super
        @name = 'move'
        @time = Math.ceil(@from.distance(@to) * 100)
    do: (brave) ->
        super brave
        brave.spot = @to
        
        @after(brave, @to.randomAction())
        {isSucceed: true}
    details: ->
        time: @time
        name: @name
        from: @from.id
        to: @to.id

class SearchAction extends Action
    probabilityMax: 1000
    constructor: (@time, @treasureDict = {}) ->
        super
        @name = 'search'
    do: (brave) ->
        super brave
        total = 0
        total += treasureInfo.probability for id, treasureInfo of @treasureDict
        return {isSucceed: false, treasure: null} if total > @probabilityMax
        
        treasureIds = (id for id, treasureInfo of @treasureDict).sort (a, b) -> 0.5 - Math.random()
        probability = 0
        probabilities = (probability += @treasureDict[id].probability for id in treasureIds)
        
        needle = Math.random() * @probabilityMax
        
        treasure = @treasureDict[id].item for id, i in treasureIds when not treasure? and needle < probabilities[i]
        
        isSucceed = null
        if treasure && brave.addItem treasure
            isSucceed = true
        else
            isSucceed = false
        
        @after(brave, brave.spot.randomAction())
        {isSucceed: isSucceed, treasure:treasure}
    details: ->
        time: @time
        name: @name

exports.Action = Action
exports.WaitAction = WaitAction
exports.MoveAction = MoveAction
exports.SearchAction = SearchAction