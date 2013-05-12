var hh = require("hh");
var Crowd = require("../index").Crowd;
var Research = require("../index").Research;
var Q = require('q');

var crowd = new Crowd();
var research1 = new Research({
  generate: function(){
    var defer = Q.defer();
    var that = this;
    process.nextTick(function(){
      defer.resolve(that.state);
    });
    return defer.promise;
  },
  update: function(result) {
    var defer = Q.defer();
    this.state = result || this.state;
    var that = this;
    process.nextTick(function() {
      defer.resolve(result);
    })
    return defer.promise;
  },
  comparator: function() {
    var defer = Q.defer();
    var that = this;
    process.nextTick(function(){
      defer.resolve(that.state <= that.last);
    })
    return defer.promise;
  },
  last: 5,
  state: 1
});
var researches = [research1];

function listen(id, result) {
  var research = researches[id];
  research.save(result)
      .then(function() {
        return research.hasNext();
      })
      .then(function(hasNext) {
        if (hasNext) return research.next();
      })
      .then(function(next){
        if (!result) console.log("* client joining at", next);
        if (next) crowd.emit("task", next);
        else crowd.emit("end", id);
      }).done();   
}

crowd.on('research', listen);
crowd.on('result', listen);

crowd.emit("research", 0);
setTimeout(function(){crowd.emit("research", 0);}, 5);

crowd.on("task", function(data){
  console.log("found", ++data);
  crowd.emit("result", 0, data);
})
crowd.on("end", function(id){
  console.log("Research", id, "finished");
})