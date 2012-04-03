{EventEmitter} = require 'events'
kue = require 'kue'

{Brave} = require './brave'
{SharedItemCreator} = require './item'
{eventProcess} = require './event'

class Simulator extends EventEmitter
    constructor : ->
        @dungeonList = []
        @braveList = []
    
    start: (config) ->
        {dungeonList, braveNameDictionary, numBraves, itemDict} = config
        SharedItemCreator.itemDict = itemDict
        
        @dungeonList = (new Dungeon dungeonInfo for dungeonInfo in dungeonInfoList)
        
        (@braveNamePrefixes ?= []).push term for term in dict for dict in [braveNameDictionary.prefixes, braveNameDictionary.terms]
        (@braveNameSuffixes ?= []).push term for term in dict for dict in [braveNameDictionary.suffixes, braveNameDictionary.terms]
        
        @braveList = (new Brave(@makeBraveName(braveNameDictionary), spawnSpot, {speed: Math.floor(Math.random() * 50) + 20}) for i in [0...numBraves])
        
        @jobs = kue.createQueue()
        @jobs.process 'event', eventProcess
    
    # 別のところに移動したい
    makeBraveName: ->
        prefixIndex = parseInt(Math.random() * @braveNamePrefixes.length)
        suffixIndex = parseInt(Math.random() * @braveNameSuffixes.length)
        
        "#{@braveNamePrefixes[prefixIndex]}#{@braveNameSuffixes[suffixIndex]}"
    
    dungeonForName: (name) ->
        (dungeon for dungeon in @dungeonList when dungeon.name == name)[0]
    
    braveForName: (name) ->
        (brave for brave in @braveList when brave.name == name)[0]
    
exports.Simulator = Simulator