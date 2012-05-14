mongoose = require 'mongoose'
{gamedate} = require '../util'

# schemas

Schema = mongoose.Schema

EventInfoSchema = new Schema
    type: String
    treasures: [{
        itemId: Number
        probability: Number
    }]

exports.EventInfoSchema = EventInfoSchema

EventInfo = mongoose.model 'Event', EventInfoSchema
exports.EventInfo = EventInfo

EventLogSchema = new Schema
    type: String
    brave:
        type: Schema.ObjectId
        ref: 'Brave'
    isSucceed: Boolean
    date: Date
    others: Schema.Types.Mixed

EventLogSchema.virtual('gamedate').get -> gamedate @date

exports.EventLogSchema = EventLogSchema

EventLog = mongoose.model 'EventLog', EventLogSchema
exports.EventLog = EventLog

# events

{ItemCreator} = require './item'

class SearchEvent
    probabilityMax: 1000
    constructor: (@treasures = []) ->
        @type = 'search'
    
    process: (brave) ->
        total = 0
        total += info.probability for info in @treasures
        
        if total > @probabilityMax
            result = {isSucceed: false, treasure: null}
            @save brave, result
            return result
        
        treasures = @treasures.sort (a, b) -> 0.5 - Math.random()
        probability = 0
        probabilities = (probability += info.probability for info in treasures)
        
        needle = Math.random() * @probabilityMax
        treasureInfo = info for info, i in treasures when not treasureInfo? and needle < probabilities[i]
        treasure = ItemCreator.create(treasureInfo.itemId, treasureInfo.name) if treasureInfo
        
        if treasure && brave.addItem treasure
            result = {isSucceed: true, treasure:treasure}
        else
            result = {isSucceed: false, treasure:treasure}
        @save brave, result
        result
    
    save: (brave, result) ->
        eventLog = new EventLog
        eventLog.type = @type
        eventLog.brave = brave
        eventLog.isSucceed = result.isSucceed
        eventLog.date = new Date
        eventLog.others = {
            treasure: result.treasure
        }
        
        eventLog.save (err) ->
            console.log err.message if err

exports.SearchEvent = SearchEvent