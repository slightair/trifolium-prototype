class Spot
    constructor: (name, posX, posY) ->
        @name = name
        @posX = posX
        @posY = posY
        @actions = []
    randomAction: ->
        index = Math.floor(Math.random() * @actions.length)
        @actions[index]
    distance: (aSpot) ->
        Math.sqrt(Math.pow(@posX - aSpot.posX) + Math.pow(@posY - aSpot.posY))

