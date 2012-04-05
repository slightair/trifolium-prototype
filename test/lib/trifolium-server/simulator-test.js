var Simulator, library, serverLibPath, should;

should = require('should');

library = process.env['TRIFOLIUM_COV'] ? 'lib-cov' : 'lib';

serverLibPath = "../../../" + library + "/trifolium-server";

Simulator = require("" + serverLibPath + "/simulator").Simulator;
