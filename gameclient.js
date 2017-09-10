// SpaceGame backend client
var EventHandler = require('events');
var netClient = require('./network.js');
var Vector = require('./vector.js');
const vectorRegex = /\[\s*(\-?\d+\.\d*(?:e\-\d*)?)\s*(\-?\d+\.\d*(?:e\-\d*)?)\s*(\-?\d+\.\d*(?:e\-\d*)?)\s*\]/;

module.exports = function() {
  this.shipCoordinates = {
    position:  new Vector.Vector3D(), 
    velocity:  new Vector.Vector3D(),
    heading:   new Vector.Vector3D()
  };

  this.netClient = new netClient();
  this.tickInterval = 1000; /// Controls how often the status is refreshed
  this.updateTimer = null;
  this.updating = false; // is an update in progress
  this.coordinateFlag = 0; // 0..2 for position, velocity, heading, 3 for complete (ready to send)
  var self = this;

  // Connectivity
  this.connect = this.netClient.connect.bind(this.netClient);
  this.disconnect = this.netClient.disconnect.bind(this.netClient);


  // Pauses the updates
  this.stopUpdates = function() {
    if(self.updateTimer) {
      clearInterval(self.updateTimer);
      self.updateTimer = null;
    }
  }

  /// Start updates with the specified interval
  this.startUpdates = function(interval) {
    if(self.netClient.connected == false) {
      console.log("Warning: cannot start updates without a valid server connection.");
      return;
    }
    if(self.updateTimer) return; // we already have a timer
    if(typeof interval !== 'undefined' && interval) {
      self.tickInterval = interval;
      console.log("Setting new interval: " + interval);
    }

    console.log("Starting updates at interval: " + self.tickInterval + "ms.");
    self.updateTimer = setInterval(updateClient.bind(self), 1000);
  }


  /// Changes the update interval
  this.setInterval = function(interval) {
    this.stopUpdates();
    this.startUpdates(interval);
  }

  // update handlers
  this.netClient.on('line', function(line) {
    if(self.updating) {
      var v = line.match(vectorRegex);

      if(v) { 
        switch( self.coordinateFlag ) {

          case 0: // position
          self.shipCoordinates.position = Vector.parseVector(line);
          break; 

          case 1: // velocity
          self.shipCoordinates.velocity = Vector.parseVector(line);
          break;

          case 2: // heading 
          self.shipCoordinates.heading = Vector.parseVector(line);
          break;
        }
        self.coordinateFlag++;

        if(self.coordinateFlag == 3) {
          console.log("Update complete.", self.shipCoordinates);
          self.coordinateFlag = 0;
          self.updating = false;
        } else {
          // Queue updates here instead of above to avoid re-entrancy mess.
          if(self.coordinateFlag == 1 ) {
            console.log("Queuing velocity");
            self.netClient.send("ship velocity\n");
          } else if(self.coordinateFlag == 2) {
            console.log("Queuing heading");
            self.netClient.send("ship position\n");
          }
        }
      } else {
        console.log("Expecting a vector, but instead got: " + line);
      }
    } else {
      console.log("Received a line outside of update cycle: " + line);
    }
  });
}

var updateClient = function() {
  if(this.netClient.connected == false) {
    console.log("Warning: trying to update without connection.");
    return;
  }
  if(this.updating) {
    console.log("Attempting an update while previous update in progress.");
    return; // An update is ongoing
  }
  this.updating = true;
  this.coordinateFlag = 0;  // Zero the flag
  this.netClient.send("ship position\n"); // Get the ball rolling
}

