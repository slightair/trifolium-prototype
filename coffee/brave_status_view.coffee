class BraveList extends Backbone.Collection
    model: Brave

class BraveStatusView extends Backbone.View
    constructor: ->
        @braveList = new BraveList([
            new Brave
        ])
        @render()
    render: ->
