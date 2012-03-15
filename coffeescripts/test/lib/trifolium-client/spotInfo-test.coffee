should = require 'should'

clientLibPath = '../../../lib/trifolium-client'
{SpotInfo}   = require "#{clientLibPath}/spotInfo"

describe 'SpotInfo', ->
    spotInfo = new SpotInfo {id: 'a5ca237533a06b6dd7d55daa84cd539bb11dcd5d', name: 'なめこの洞窟', posX: 120, posY: -80}
    
    it 'should have id', ->
        should.exist spotInfo.id
        spotInfo.id.should.equal '28733e5e7c135e41a8c734f15283b6a186335846'
    
    it 'should have name', ->
        should.exist spotInfo.name
        spotInfo.name.should.equal 'なめこの洞窟'
    
    it 'should have posX', ->
        should.exist spotInfo.posX
        spotInfo.posX.should.equal 120
    
    it 'should have posY', ->
        should.exist spotInfo.posY
        spotInfo.posY.should.equal -80
