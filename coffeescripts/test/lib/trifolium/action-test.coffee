should = require 'should'
{Brave} = require '../lib/trifolium/brave'
{Spot} = require '../lib/trifolium/spot'
{Action, WaitAction, MoveAction, SearchAction} = require '../lib/trifolium/action'

describe 'Action', ->
    action = new Action()
    
    it 'should have no name', ->
        should.not.exist(action.name)
    
    it 'should have time', ->
        action.time.should.equal(0)
    
    describe '#do()', ->
        spot = new Spot 'testSpot', 0, 0
        brave = new Brave 'testBrave', spot
        
        beforeEach ->
            brave.action = 'dummy'
            brave.actionProcess = 0.5
        
        it 'should set null to brave.action', ->
            action.do brave
            should.not.exist(brave.action)
        it 'should set 0.0 to brave.actionProcess', ->
            action.do brave
            brave.actionProcess.should.equal(0)
        it 'should call brave.doneAction()', (done) ->
            brave.addListener
                completeBraveAction: ->
                    done()
            action.do brave
    describe '#after()', ->
        it 'should call nextAction.prepare()'
        it 'should set nextAction to brave.action'
        it 'should set destination to brave.destination'

describe 'WaitAction', ->
    action = new WaitAction(5000)
    it 'should have name', ->
        action.name.should.equal('wait')
    it 'should have time', ->
        action.time.should.equal(5000)
