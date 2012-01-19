class Action
    constructor: ->
        @process = 0.0
        @isSucceed = false
    prepare: ->
        
    do: ->
        @isSucceed = true
    after: ->
        

class WaitAction extends Action
    constructor: ->
        super

class MoveAction extends Action
    constructor: ->
        super
        @from = null
        @to = null

class SearchAction extends Action
    probabilityMax: 1000
    constructor: (treasureDict) ->
        super
        @treasureDict = treasureDict
        @treasure = null
    do: ->
        total = 0
        total += probability for treasure, probability of @treasureDict
        return @isSucceed = false if total > @probabilityMax
        
        treasures = (treasure for treasure, probability of @treasureDict).sort (a, b) -> 0.5 - Math.random()
        probability = 0
        probabilities = (probability += @treasureDict[treasure] for treasure in treasures)
        
        needle = Math.random() * @probabilityMax
        @treasure = treasure for treasure, i in treasures when not @treasure? and needle < probabilities[i]
        
        @isSucceed = @treasure?

