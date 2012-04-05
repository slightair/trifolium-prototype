crypto = require 'crypto'
{EventEmitter} = require 'events'

class Brave extends EventEmitter
    constructor: (@name, options = {}) ->
        date = new Date
        @id    = crypto.createHash('sha1').update("#{@name}")
                                          .update('b9889216daa1ccab')
                                          .update("#{date.getTime()}")
                                          .update("#{date.getMilliseconds()}")
                                          .digest('hex')
        @lv    = options.lv    ? 1
        @atk   = options.atk   ? 1
        @matk  = options.matk  ? 1
        @hp    = options.hp    ? 10
        @mp    = options.mp    ? 10
        @brave = options.brave ? 50
        @faith = options.faith ? 50
        @speed = options.speed ? 3
        @gold  = options.gold  ? 300
        @items = options.items ? []
    
    addItem: (item) ->
        if @items.length < 10
            @items.push item 
            true
        else
            false
    
    removeItem: (item) ->
        @items = (i for i in @items when i != item)
    
    details: ->
        id: @id
        name: @name
        lv: @lv
        atk: @atk
        matk: @matk
        hp: @hp
        mp: @mp
        brave: @brave
        faith: @faith
        speed: @speed
        gold: @gold
        items: (item.details() for item in @items)

class BraveCreator
    constructor: ->
        @braveNamePrefixes = []
        @braveNameSuffixes = []
    setBraveNameDict: (braveNameDict) ->
        braveNamePrefixes = []
        braveNameSuffixes = []
        braveNamePrefixes.push term for term in dict for dict in [braveNameDict.prefixes, braveNameDict.terms]
        braveNameSuffixes.push term for term in dict for dict in [braveNameDict.suffixes, braveNameDict.terms]
        
        @braveNamePrefixes = braveNamePrefixes
        @braveNameSuffixes = braveNameSuffixes
    create: (options = {}) ->
        new Brave @makeBraveName(), options
    makeBraveName: ->
        prefixIndex = parseInt(Math.random() * @braveNamePrefixes.length)
        suffixIndex = parseInt(Math.random() * @braveNameSuffixes.length)
        
        "#{@braveNamePrefixes[prefixIndex]}#{@braveNameSuffixes[suffixIndex]}"

exports.Brave = Brave
exports.BraveCreator = new BraveCreator
