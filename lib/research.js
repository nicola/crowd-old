var Q = require("q");
var util = require('util')

function Research(options) {
  options = options || {};
  this.last = options.last;
  this.state = options.state;
  this.code = options.code || {};
  
  this.generate = options.generate;
  this.update = options.update;
  this.comparator = options.comparator;
}

Research.prototype.hasNext = function(callback) {
  var promise = this.comparator.call(this);
  if (callback) return promise.then(callback)
  return promise;
}

Research.prototype.next = function(callback) {
  var promise = this.generate.call(this);
  if (callback) return promise.then(callback);
  return promise;
}

Research.prototype.save = function(result, callback) {
  var promise = this.update.call(this, result);
  if (callback) return promise.then(callback);
  return promise;
}

module.exports = Research;