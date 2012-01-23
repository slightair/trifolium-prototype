class Action
    constructor: ->
        @name = null
        @process = 0.0
        @isSucceed = false
    prepare: (brave) ->
        
    tick: (brave) ->
        @process += brave.speed / 100
    do: (brave) ->
        @isSucceed = true
    after: (brave) ->
        brave.action = null

class WaitAction extends Action
    constructor: ->
        super
        @name = 'wait'

class MoveAction extends Action
    constructor: (from, to) ->
        super
        @name = 'move'
        @from = from
        @to = to
    after: (brave) ->
        super brave
        console.log "#{brave.name} is arrived at #{@to.name}"

class SearchAction extends Action
    probabilityMax: 1000
    constructor: (treasureDict) ->
        super
        @name = 'search'
        @treasureDict = treasureDict
        @treasure = null
    do: (brave) ->
        total = 0
        total += probability for treasure, probability of @treasureDict
        return @isSucceed = false if total > @probabilityMax
        
        treasures = (treasure for treasure, probability of @treasureDict).sort (a, b) -> 0.5 - Math.random()
        probability = 0
        probabilities = (probability += @treasureDict[treasure] for treasure in treasures)
        
        needle = Math.random() * @probabilityMax
        @treasure = treasure for treasure, i in treasures when not @treasure? and needle < probabilities[i]
        
        @isSucceed = @treasure?

