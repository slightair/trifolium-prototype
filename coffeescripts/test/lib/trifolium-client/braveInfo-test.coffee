should = require 'should'

clientLibPath = '../../../lib/trifolium-client'
{BraveInfo}  = require "#{clientLibPath}/braveInfo"
{ActionInfo} = require "#{clientLibPath}/actionInfo"
{ItemInfo}   = require "#{clientLibPath}/itemInfo"
{SpotInfo}   = require "#{clientLibPath}/spotInfo"

describe 'BraveInfo', ->
    braveInfo = new BraveInfo
        id: '69a851de6ac432459caa017441e0d94f0e80352a'
        name: 'ポワスケ'
        lv: 1
        atk: 1
        matk: 1
        hp: 10
        mp: 10
        brave: 50
        faith: 50
        speed: 53
        gold: 300
        items: [
            new ItemInfo {id: '28733e5e7c135e41a8c734f15283b6a186335846', name: 'いいきのこ', itemId: 2}
        ]
        action: new ActionInfo
            time: 7211.102550927979
            name: 'move'
            from: '26a93c17ec27e9918b25f9a3b4169a603f474174'
            to: 'de0cde838525b7e8f7ef586b2ed62a816a295760'
        actionProcess: 0.4997848767989314
        spot: new SpotInfo
            id: '83ba0e93ae676c7d2c0589baaff223d41aed064c'
        destination: new SpotInfo
            id: 'de0cde838525b7e8f7ef586b2ed62a816a295760'
    
    it 'should have id', ->
        should.exist braveInfo.id
        braveInfo.id.should.equal '69a851de6ac432459caa017441e0d94f0e80352a'
    
    it 'should have name', ->
        should.exist braveInfo.name
        braveInfo.name.should.equal 'ポワスケ'
    
    it 'should have lv', ->
        should.exist braveInfo.lv
        braveInfo.lv.should.equal 1
    
    it 'should have atk', ->
        should.exist braveInfo.atk
        braveInfo.atk.should.equal 1
    
    it 'should have matk', ->
        should.exist braveInfo.matk
        braveInfo.matk.should.equal 1
    
    it 'should have hp', ->
        should.exist braveInfo.hp
        braveInfo.hp.should.equal 10
    
    it 'should have mp', ->
        should.exist braveInfo.mp
        braveInfo.mp.should.equal 10
    
    it 'should have brave', ->
        should.exist braveInfo.brave
        braveInfo.brave.should.equal 50
    
    it 'should have faith', ->
        should.exist braveInfo.faith
        braveInfo.faith.should.equal 50
    
    it 'should have speed', ->
        should.exist braveInfo.speed
        braveInfo.speed.should.equal 53
    
    it 'should have gold', ->
        should.exist braveInfo.gold
        braveInfo.gold.should.equal 300
    
    it 'should have items', ->
        should.exist braveInfo.items
        braveInfo.items.should.be.an.instanceof Array
        braveInfo.items[0].should.be.an.instanceof ItemInfo
        braveInfo.items[0].id.should.equal '28733e5e7c135e41a8c734f15283b6a186335846'
    
    it 'should have action', ->
        should.exist braveInfo.action
        braveInfo.action.should.be.an.instanceof ActionInfo
        braveInfo.action.name.should.be.equal 
    
    it 'should have actionProcess', ->
        should.exist braveInfo.actionProcess
        braveInfo.actionProcess.should.equal 0.4997848767989314
    
    it 'should have spot', ->
        should.exist braveInfo.spot
        braveInfo.spot.should.be.an.instanceof SpotInfo
        braveInfo.spot.id.should.equal '83ba0e93ae676c7d2c0589baaff223d41aed064c'
    
    it 'should have destination', ->
        should.exist braveInfo.destination
        braveInfo.destination.should.be.an.instanceof SpotInfo
        braveInfo.destination.id.should.equal 'de0cde838525b7e8f7ef586b2ed62a816a295760'
    
    describe '#addItem()', ->
        info = new BraveInfo {}
        
        it 'should add item', ->
            item = 'dummy item'
            info.items.should.be.empty
            info.addItem item
            info.items.should.not.be.empty
            info.items.should.include item
            
    describe '#updateActionProcess()', ->
        info = new BraveInfo
            speed: 50
            actionProcess: 0.0
            action: new ActionInfo
                time: 10000
                name: 'wait'
        
        it 'should update actionProcess', ->
            info.actionProcess.should.equal 0.0
            info.updateActionProcess 30
            info.actionProcess.should.equal 0.15
            
    describe '#updateAction()', ->
        info = new BraveInfo
            actionProcess: 0.5
        
        it 'should update actionProcess', ->
            info.actionProcess.should.equal 0.5
            info.updateAction 'dummy action'
            info.actionProcess.should.equal 0.0

        