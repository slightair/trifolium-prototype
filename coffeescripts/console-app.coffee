Trifolium = require('./lib/trifolium').Trifolium
settings = require('./settings').settings

simulator = new Trifolium(settings)
simulator.start()