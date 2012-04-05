should = require 'should'

library = if process.env['TRIFOLIUM_COV'] then 'lib-cov' else 'lib'
serverLibPath = "../../../#{library}/trifolium-server"
{Brave, BraveCreator} = require "#{serverLibPath}/brave"
{Item} = require "#{serverLibPath}/item"

describe 'Brave', ->
    brave = null
    
    beforeEach ->
        brave = new Brave 'testBrave'
    
    it 'should have id', ->
        should.exist brave.id
    
    it 'should have name', ->
        brave.name.should.equal 'testBrave'
    
    it 'should have lv', ->
        brave.lv.should.equal 1
    
    it 'should have atk', ->
        brave.atk.should.equal 1
    
    it 'should have matk', ->
        brave.matk.should.equal 1
    
    it 'should have hp', ->
        brave.hp.should.equal 10
    
    it 'should have mp', ->
        brave.mp.should.equal 10
    
    it 'should have brave', ->
        brave.brave.should.equal 50
    
    it 'should have faith', ->
        brave.faith.should.equal 50
    
    it 'should have speed', ->
        brave.speed.should.equal 3
    
    it 'should have items', ->
        brave.items.should.be.an.instanceof Array
        brave.items.should.be.empty
    
    it 'should have gold', ->
        brave.gold.should.equal 300
    
    describe '#addItem()', ->
        
        beforeEach ->
            brave.items = []
        
        it 'should add an item', ->
            item = new Item
            
            brave.items.should.be.empty
            result = brave.addItem item
            brave.items.should.include item
            result.should.be.ok
        
        it 'should not add item over 10 items', ->
            brave.addItem new Item for i in [0...10]
            brave.items.should.have.length 10
            result = brave.addItem new Item
            result.should.not.be.ok
            brave.items.should.have.length 10
    
    describe '#removeItem()', ->
        item = new Item
        
        beforeEach ->
            brave.items = [item]
        
        it 'should remove an item', ->
            brave.items.should.not.be.empty
            brave.items.should.include item
            brave.removeItem item
            brave.items.should.not.include item
            brave.items.should.be.empty
        
        it 'should not remove no include item', ->
            another = new Item
            
            brave.items.should.not.be.empty
            brave.items.should.include(item)
            brave.items.should.not.include(another)
            brave.removeItem another
            brave.items.should.not.be.empty
            brave.items.should.include(item)
            brave.items.should.not.include(another)

    describe '#details()', ->
        item = new Item
        
        beforeEach ->
            brave.items = [item]
        
        it 'should return brave details', ->
            details = brave.details()
            should.exist details
            details.should.be.an.instanceof Object
            
            should.exist details.id, 'id should exist'
            details.id.should.equal brave.id
            
            should.exist details.name, 'name should exist'
            details.name.should.equal 'testBrave'
            
            should.exist details.lv, 'lv should exist'
            details.lv.should.equal 1
            
            should.exist details.atk, 'atk should exist'
            details.atk.should.equal 1
            
            should.exist details.matk, 'matk should exist'
            details.matk.should.equal 1
            
            should.exist details.hp, 'hp should exist'
            details.hp.should.equal 10
            
            should.exist details.mp, 'mp should exist'
            details.mp.should.equal 10
            
            should.exist details.brave, 'brave should exist'
            details.brave.should.equal 50
            
            should.exist details.faith, 'faith should exist'
            details.faith.should.equal 50
            
            should.exist details.speed, 'speed should exist'
            details.speed.should.equal 3
            
            should.exist details.gold, 'gold should exist'
            details.gold.should.equal 300
            
            should.exist details.items, 'items should exist'
            details.items.should.be.an.instanceof Array
            details.items[0].should.be.an.instanceof Object
            details.items[0].id.should.equal item.id

describe 'BraveCreator', ->
    
    it 'should have braveNamePrefixes', ->
        BraveCreator.braveNamePrefixes.should.be.an.instanceof Array
    
    it 'should have braveNameSuffixes', ->
        BraveCreator.braveNameSuffixes.should.be.an.instanceof Array
    
    describe '#setBraveNameDict()', ->
        
        it 'should set new brave name dictionary after clear old dictionary.', ->
            BraveCreator.setBraveNameDict {
                terms: [
                    '1'
                    '2'
                    '3'
                ]
                prefixes: [
                    'A'
                    'B'
                    'C'
                ]
                suffixes: [
                    'a'
                    'b'
                    'c'
                ]
            }
            
            BraveCreator.braveNamePrefixes.should.be.include('1').include('2').include('3').include('A').include('B').include('C')
            BraveCreator.braveNameSuffixes.should.be.include('1').include('2').include('3').include('a').include('b').include('c')
            
            BraveCreator.setBraveNameDict {
                terms: [
                    '4'
                    '5'
                    '6'
                ]
                prefixes: [
                    'D'
                    'E'
                    'F'
                ]
                suffixes: [
                    'd'
                    'e'
                    'f'
                ]
            }
            
            BraveCreator.braveNamePrefixes.should.not.be.include('1').include('2').include('3').include('A').include('B').include('C')
            BraveCreator.braveNameSuffixes.should.not.be.include('1').include('2').include('3').include('a').include('b').include('c')
            BraveCreator.braveNamePrefixes.should.be.include('4').include('5').include('6').include('D').include('E').include('F')
            BraveCreator.braveNameSuffixes.should.be.include('4').include('5').include('6').include('d').include('e').include('f')
    
    describe '#create()', ->
        
        it 'should create brave', ->
            BraveCreator.setBraveNameDict {
                terms: [
                    '1'
                    '2'
                    '3'
                ]
                prefixes: [
                    'A'
                    'B'
                    'C'
                ]
                suffixes: [
                    'a'
                    'b'
                    'c'
                ]
            }
            
            weakBrave = BraveCreator.create {
                hp: 1
                mp: 1
                speed: 1
            }
            weakBrave.hp.should.equal 1
            weakBrave.mp.should.equal 1
            weakBrave.speed.should.equal 1
            weakBrave.name.should.match /[123ABC][123abc]/
            
            strongBrave = BraveCreator.create {
                hp: 1000
                mp: 1000
                speed: 100
            }
            strongBrave.hp.should.equal 1000
            strongBrave.mp.should.equal 1000
            strongBrave.speed.should.equal 100
            strongBrave.name.should.match /[123ABC][123abc]/
        
    describe '#makeBraveName()', ->
        
        it 'should return new brave name with braveNameDict.', ->
            BraveCreator.setBraveNameDict {
                terms: [
                    '1'
                    '2'
                    '3'
                ]
                prefixes: [
                    'A'
                    'B'
                    'C'
                ]
                suffixes: [
                    'a'
                    'b'
                    'c'
                ]
            }
            
            for i in [1..50]
                name = BraveCreator.makeBraveName()
                name.should.match /[123ABC][123abc]/
