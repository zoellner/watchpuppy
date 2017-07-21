'use strict';

const EventEmitter = require('events');

// options (defaults)
// minPing (1): minimum number of pings to receive between check intervals
// checkInterval (10000): interval (in ms) between checks
// stopOnError (true): when true the checks will stop after the first failed check

class Watchpuppy extends EventEmitter {
  constructor(options, callback) {
    super();

    if (typeof options === 'function') {
      callback = options;
      options = {};
    }

    this.minPing = options.minPing || 1;
    this.checkInterval = options.checkInterval || 10000;
    this.stopOnError = options.stopOnError || true;

    //internal properties
    this.counter = 0;
    this.interval = setInterval(() => this.emit('check'), this.checkInterval);

    //setup listeners
    this.on('ping', function() {
      this.counter++;
    });

    this.on('check', function() {
      if (this.counter < this.minPing) {
        //something is wrong. emit error
        this.emit('error', new Error(`only ${this.counter} pings received since last check`));
      }
      this.counter = 0;
    });

    this.on('error', function(err) {
      if (this.stopOnError) {
        this.stop();
      }
      callback(err);
    });
  }

  //it is possible to give more weight to a ping or disable it by passing in a negative number
  ping(num) {
    num = 1 * num || 1;
    for (let i = 0; i < num; i++) {
      this.emit('ping');
    }
  }

  stop() {
    clearInterval(this.interval);
  }
}

module.exports = Watchpuppy;
