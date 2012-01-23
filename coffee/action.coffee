class Action
    constructor: ->
        @name = null
        @isSucceed = false
        @time = 0
    prepare: (brave) ->
        
    do: (brave) ->
        @isSucceed = true
        brave.action = null
        brave.actionProcess = 0.0

class WaitAction extends Action
    constructor: ->
        super
        @name = 'wait'
        @time = 300

class MoveAction extends Action
    constructor: (from, to) ->
        super
        @name = 'move'
        @from = from
        @to = to
        @time = from.distance(to) * 100
    do: (brave) ->
        super brave
        console.log "#{brave.name} is arrived at #{@to.name}"
        
        nextAction = @to.randomAction()
        nextAction.prepare(brave)
        brave.action = nextAction
        @isSucceed

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
