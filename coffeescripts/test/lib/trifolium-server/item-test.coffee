should = require 'should'

library = if process.env['TRIFOLIUM_COV'] then 'lib-cov' else 'lib'
serverLibPath = "../../../#{library}/trifolium-server"
{Item, ItemCreator} = require "#{serverLibPath}/item"

itemDict = {
    1:
        name: 'きのこ'
    2:
        name: 'ちくわ'
    3:
        name: 'いいちくわ'
    4:
        name: 'おにく'
    5:
        name: 'いいおにく'
    10:
        name: '竹の槍'
}

describe 'ItemCreator', ->
    ItemCreator.setItemDict itemDict
    
    it 'should have itemDict', ->
        ItemCreator.itemDict.should.be.an.instanceof Object
    
    describe '#create()', ->
        it 'should create item', ->
            kinoko = ItemCreator.create 1
            kinoko.itemId.should.equal 1
            kinoko.name.should.equal 'きのこ'
            
            strangeKinoko = ItemCreator.create 1, 'へんなきのこ'
            strangeKinoko.itemId.should.equal 1
            strangeKinoko.name.should.equal 'へんなきのこ'
            
            unknownItem = ItemCreator.create -1
            should.not.exist unknownItem

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
        
    describe '#details()', ->
        
        it 'should return item details', ->
            details = kinoko.details()
            should.exist details
            details.should.be.an.instanceof Object
            should.exist details.id, 'id should exist'
            details.id.should.equal kinoko.id
            should.exist details.itemId, 'itemId should exist'
            details.itemId.should.equal 1
            should.exist details.name, 'name should exist'
            details.name.should.equal 'きのこ'
