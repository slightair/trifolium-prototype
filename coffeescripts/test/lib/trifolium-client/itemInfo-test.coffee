should = require 'should'

clientLibPath = '../../../lib/trifolium-client'
{ItemInfo}   = require "#{clientLibPath}/itemInfo"

describe 'ItemInfo', ->
    itemInfo = new ItemInfo {id: '28733e5e7c135e41a8c734f15283b6a186335846', name: 'いいきのこ', itemId: 2}
    
    it 'should have id', ->
        should.exist itemInfo.id
        itemInfo.id.should.equal '28733e5e7c135e41a8c734f15283b6a186335846'
    
    it 'should have name', ->
        should.exist itemInfo.name
        itemInfo.name.should.equal 'いいきのこ'
    
    it 'should have itemId', ->
        should.exist itemInfo.itemId
        itemInfo.itemId.should.equal 2
