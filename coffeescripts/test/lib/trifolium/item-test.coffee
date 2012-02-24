should = require 'should'
{Item} = require '../lib/trifolium/item'

describe 'item', ->
    item = new Item
    kinoko = new Item "きのこ"
    
    it 'should have name', ->
        item.name.should.equal "unknown"
        kinoko.name.should.equal "きのこ"
    
    it 'should have id', ->
        should.exist item.id
        should.exist kinoko.id