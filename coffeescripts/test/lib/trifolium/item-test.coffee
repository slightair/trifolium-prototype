should = require 'should'
{Item, ItemCreator} = require '../lib/trifolium/item'
{itemDict} = require '../settings.js'

describe 'ItemCreator', ->
    itemCreator = new ItemCreator itemDict
    
    it 'should have itemDict', ->
        itemCreator.should.be.an.instanceof Object
    
    describe '#createItem()', ->
        it 'should create item', ->
            kinoko = itemCreator.createItem 1
            kinoko.itemId.should.equal 1
            kinoko.name.should.equal 'きのこ'
            
            strangeKinoko = itemCreator.createItem 1, 'へんなきのこ'
            strangeKinoko.itemId.should.equal 1
            strangeKinoko.name.should.equal 'へんなきのこ'
            
            unknownItem = itemCreator.createItem -1
            should.not.exist.unknownItem

describe 'Item', ->
    kinoko = new Item 1, 'きのこ'
    oniku = new Item 4, 'おにく'
    unknown = new Item 9999, 'unknown'
    
    it 'should have itemId', ->
        kinoko.itemId.should.equal 1
        oniku.itemId.should.equal 4
        unknown.itemId.should.equal 9999
    
    it 'should have name', ->
        kinoko.name.should.equal "きのこ"
        oniku.name.should.equal "おにく"
        unknown.name.should.equal "unknown"
    
    it 'should have id', ->
        should.exist kinoko.id
        should.exist oniku.id
        should.exist unknown.id