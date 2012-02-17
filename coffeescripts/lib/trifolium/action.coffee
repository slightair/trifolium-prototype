class Action
    constructor: ->
        @name = null
        @isSucceed = false
        @time = 0
    prepare: (brave) ->
        
    do: (brave) ->
        brave.action = null
        brave.actionProcess = 0.0
        brave.doneAction @
        @isSucceed = false
    after: (brave, nextAction) ->
        nextAction.prepare brave
        brave.action = nextAction
        brave.destination = nextAction.to ? brave.spot

class WaitAction extends Action
    constructor: (time) ->
        super
        @name = 'wait'
        @time = time
    do: (brave) ->
        super brave
        
        @after(brave, brave.spot.randomAction())
        @isSucceed = true

class MoveAction extends Action
    constructor: (from, to) ->
        super
        @name = 'move'
        @from = from
        @to = to
        @time = from.distance(to) * 100
    do: (brave) ->
        super brave
        brave.spot = @to
        
        @after(brave, @to.randomAction())
        @isSucceed = true

class SearchAction extends Action
    probabilityMax: 1000
    constructor: (treasureDict) ->
        super
        @name = 'search'
        @treasureDict = treasureDict
        @treasure = null
        @time = 1000
    do: (brave) ->
        super brave
        total = 0
        total += probability for treasure, probability of @treasureDict
        return @isSucceed = false if total > @probabilityMax
        
        treasures = (treasure for treasure, probability of @treasureDict).sort (a, b) -> 0.5 - Math.random()
        probability = 0
        probabilities = (probability += @treasureDict[treasure] for treasure in treasures)
        
        needle = Math.random() * @probabilityMax
        @treasure = treasure for treasure, i in treasures when not @treasure? and needle < probabilities[i]
        
        @isSucceed = @treasure?

exports?.Action = Action
exports?.WaitAction = WaitAction
exports?.MoveAction = MoveAction
exports?.SearchAction = SearchAction