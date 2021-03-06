// TCP Socket client 
//
// Events 
//
// Connection:
//
// 'connected'      - client has succesfully connected to the server
// 'disconnected'   - client was disconnected
// 'error'          - there was a connection error
//
// 'line'           - the client sent a line of data
// 'data'           - any data from the client
//

// Constants

const DEFAULT_HOST = '127.0.0.1';
const DEFAULT_PORT = 1961;

// Requirements


// Custom emitter
var EventEmitter = require('events');
class ClientEmitter extends EventEmitter {}

var net = require('net');

var client = function() {
  var self = this;
  this.connected = false;
  this.host = DEFAULT_HOST;
  this.port = DEFAULT_PORT;
  self.emitter = new ClientEmitter();
  this.socket = new net.Socket();
  this.socket.setEncoding('utf8'); 
  this._buffer = null;

  // Event hooks
  this.on = function(name, callback) {
    if(self.emitter !== 'undefined') {
      self.emitter.on(name, callback);
    }
  }

  this.socket.on('error', (err) => {
    console.log(err);
  });

  this.socket.on('close', () => {
    self.emitter.emit('disconnected');
  });

  this.socket.on('data', (data) => {
    if(typeof this._buffer === 'undefined' || !this._buffer) {
      this._buffer = "";
    }
    //console.log("Raw data: " + data);
    this._buffer += data;


    if(this._buffer.match(/\n/)) {
      var len = this._buffer.indexOf("\n");
      var line = this._buffer.slice(0,len);
      this.emitter.emit('line', line);
      this._buffer = this._buffer.slice(len+1);
    }

  });

  this.socket.on('end', function() {

  });

  // Connection functions

  this.connect = function(address = null) {
    // Parse address if given
    if(typeof address !== 'undefined' && address) {
      if(address.match(/\:/)) {
        var t = address.split(":");
        try {
          this.port = parseInt(t[1]);
          this.address = t[0];
        } 
        catch(e) {
          console.error("Invalid address format: " + address);

          // Restore defaults
          this.port = DEFAULT_PORT;
          this.host = DEFAULT_HOST;

          return;
        }
      } else {
        if(typeof address === 'string') {
          this.host = address;
        } else {
          console.error("Invalid address: ", address);

          return;
        }
      }
    }

    console.log("Trying to connect to " + this.host + ":" + this.port);
    this.socket.connect(this.port, this.host, function() {
      console.log("Connected");
      self.connected = true;
      self.emitter.emit('connected');
    });

  }

  // Closes the socket end removes event handlers
  this.close = function() {
    self.socket.end(); 
    self.socket = null;
    self.removeListeners();
    self.emitter = null;
  }

  this.disconnect = function() {
    try {
    self.socket.send("quit\n");
    }
    catch(e) {
      self._error(e.message);
    }
    self.close();
    self.connected = false;
  }

  this.removeListeners = function() {
    this.emitter.removeAllListeners('connected');
    this.emitter.removeAllListeners('disconnected');
    this.emitter.removeAllListeners('error');
    this.emitter.removeAllListeners('line');
    this.emitter.removeAllListeners('data');
  }
  /// Send to server
  this.send = function(data) {
    if(self.socket.writable === false) { 
      console.log("Socket is not writable");
      self._error( "Unable to write to socket");
      return;
    }
    try {
      this.socket.write(data);
    }
    catch(e) {
      console.log("Something went wrong: " + e.message);
      //this.emitter.emit('connection_error', "Error while writing to socket: " + e.message); 
    }
  }

  this._error = function(err) {
    // If anyone is listening, let them know
   if(self.emitter.listenerCount('error') > 0) {
      self.emitter.emit('error', err);
   } else {
      console.error(err);
   }

  }
}

module.exports = client;
