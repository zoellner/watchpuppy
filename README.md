# Watchpuppy 🐶
## An almost fully grown watchdog for node.js

This is a simple watchdog for node.js. It has no external dependencies and runs within the node process itself.
This is not meant to replace something like an external health check service or a more advanced tool like [foreverjs](https://github.com/foreverjs/forever).

But sometimes you just need to keep an eye out on a simple worker script and make sure it is stil crunching data.

It is kept simple, i.e. there are no dependencies, just plain simple JavaScript (ES6).

Pull requests welcome.


## Install

```
npm install watchpuppy
```

## Usage

Simple example checking every 5 minutes and exiting the process if there weren't at least two pings:
```js
const Watchpuppy = require('watchpuppy');

//setup watchpuppy

//defaults:
// checkInterval: 10000 (10s)
// minPing: 1
// stopOnError: true (stop the watchpuppy when a check fails)

//example:
// check every 5 minutes (checkInterval in ms)
// require at least two pings in the 5 min window
// stop checking after first error
// exit process on error

const options = {checkInterval: 5 * 60 * 1000, minPing: 1, stopOnError: true};
const callback = (err) => {
  console.error(err);
  process.exit(1);
};

const watchpuppy = new Watchpuppy(options, callback);

//fire a ping whenever you know things are running fine, e.g. somewhere in your stream processing
watchpuppy.ping();

//you can modify the weight of a ping by passing in a number
watchpuppy.ping(5); //equivalent to firing watchpuppy.ping() five times

//you can also invalidate a ping by passing in a negative number
watchpuppy.ping(-1); //doesn't do anything
```

Another example that doesn't stop on the first failure and simply logs errors to the console:
```js
const Watchpuppy = require('watchpuppy');

const options = {stopOnError: false, minPing: 5};
const callback = (err) => {
  //err is a js Error with a message such as: 'only 3 pings received since last check'
  console.log(err.message);
};

const watchpuppy = new Watchpuppy(options, callback);
```

## License

This module is licensed under the MIT license.
