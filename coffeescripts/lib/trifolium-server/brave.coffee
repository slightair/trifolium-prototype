crypto = require 'crypto'
mongoose = require 'mongoose'

Schema = mongoose.Schema
ObjectId = Schema.ObjectId

{step} = require '../util'

BraveSchema = new Schema
    name: String
    level: Number
    attack: Number
    magic: Number
    maxhp: Number
    hp: Number
    maxmp: Number
    mp: Number
    brave: Number
    faith: Number
    speed: Number
    gold: Number
    items: [{
        name: String
        itemId: Number
        hash: String
    }]
    hash: String

BraveSchema.methods.addItem = (item) ->
    if @items.length < 10
        @items.push item
        @save (err) ->
            console.log err.message if err
        true
    else
        false

BraveSchema.methods.removeItem = (item) ->
    @items = (i for i in @items when i != item)
    @save (err) ->
        console.log err.message if err
    @items

exports.BraveSchema = BraveSchema

Brave = mongoose.model 'Brave', BraveSchema
exports.Brave = Brave

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
    
    create: (info, next) ->
        @createBraves [info] next
    
    createBraves: (infoList, next) ->
        saveBraveFunctions = []
        braves = []
        
        for info in infoList
            saveBraveFunctions.push (done) =>
                brave = new Brave
                
                brave.name   = @makeBraveName()
                brave.level  = info.level ? 1
                brave.attack = info.attack ? 1
                brave.magic  = info.magic ? 1
                brave.maxhp  = info.maxhp ? 10
                brave.hp     = info.maxhp ? 10
                brave.maxmp  = info.maxmp ? 10
                brave.mp     = info.maxmp ? 10
                brave.brave  = info.brave ? 50
                brave.faith  = info.faith ? 50
                brave.speed  = info.speed ? 3
                brave.gold   = info.gold ? 300
                brave.items  = info.items ? []
                brave.hash = crypto.createHash('sha1').update(brave.id).update('cf3e3815').digest('hex').substr(0, 12)
                
                brave.save (err) ->
                    console.log err.message if err
                    braves.push brave
                    done()
        
        step saveBraveFunctions, -> next(braves)
    
    makeBraveName: ->
        prefixIndex = parseInt(Math.random() * @braveNamePrefixes.length)
        suffixIndex = parseInt(Math.random() * @braveNameSuffixes.length)
        
        "#{@braveNamePrefixes[prefixIndex]}#{@braveNameSuffixes[suffixIndex]}"

exports.BraveCreator = new BraveCreator