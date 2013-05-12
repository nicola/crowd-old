var EventEmitter = require('events').EventEmitter;
var util = require('util');

function Crowd () {}
util.inherits(Crowd, EventEmitter);

module.exports = Crowd;