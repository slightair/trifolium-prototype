crypto = require 'crypto'
{Action, WaitAction, MoveAction, SearchAction} = require './action'
{SharedItemCreator} = require './item'

class Spot
    constructor: (@name, @posX, @posY, actionInfoList = []) ->
        date = new Date
        @id = crypto.createHash('sha1').update("#{@name}")
                                       .update("#{@posX}-#{@posY}")
                                       .update('6b1d6cfdb9889216')
                                       .update("#{date.getTime()}")
                                       .update("#{date.getMilliseconds()}")
                                       .digest('hex')
        @actions = @makeActions(actionInfoList)
    randomAction: ->
        index = Math.floor(Math.random() * @actions.length)
        @actions[index]
    distance: (aSpot) ->
        Math.sqrt(Math.pow(@posX - aSpot.posX, 2) + Math.pow(@posY - aSpot.posY, 2))
    makeActions: (actionInfoList) ->
        actions = []
        if actionInfoList?
            for actionInfo in actionInfoList
                action = null
                switch actionInfo.type
                    when 'wait'
                        action = new WaitAction actionInfo.time
                    when 'search'
                        treasureDict = {}
                        for treasureInfo in actionInfo.treasures
                            item = SharedItemCreator.createItem treasureInfo.itemId, treasureInfo.name
                            treasureDict[item.id] = {
                                item: item
                                probability: treasureInfo.probability
                            }
                        action = new SearchAction actionInfo.time, treasureDict
                        
                actions.push action if action?
        actions

exports.Spot = Spot