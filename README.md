[![Build Status](https://travis-ci.org/zachrose/barrel.svg?branch=master)](https://travis-ci.org/zachrose/barrel)
[![Dependencies](https://david-dm.org/zachrose/barrel/status.svg)](https://david-dm.org/zachrose/barrel)
[![Dev Dependencies](https://david-dm.org/zachrose/barrel/dev-status.svg)](https://david-dm.org/zachrose/barrel?type=dev)

Everyone knows that time-based things can be done with setTimeout in JavaScript:

```JavaScript
  var doSomething = function(){ console.log("Doing something") };
  var milliseconds = 1000;
  setTimeout(doSomething, milliseconds);
```

What this JavaScript library presupposes is: maybe we can shift things around a bit?

```JavaScript
var something = "something";
var doer = function(thing){ console.log("Doing " + thing) };
var milliseconds = 1000;
var event = { time: milliseconds, data: something };
```

So now we've separated our function `doSomething` into another function and some data that can be passed to it. We've also joined that data together with the desired timing, and called that combination an "event."

After doing this, we can think of having a sequence of events that exists separately from the playback mechanism that performs them. Imagine, for instance:

```JavaScript
var sequence = [
  { time: 1000, data: "something" },
  { time: 2000, data: "something else" },
  { time: 4000, data: "something again" }
]
```

This is where Barrel comes in, providing a Player that you can initialize with that doer, load the sequence into, and hit play:

```JavaScript
var player = new Barrel.Player(doer).load(sequence);
document.getElementById('play').onclick = function(){ player.play() };
document.getElementById('pause').onclick = function(){ player.pause() };
```

So far this is all pretty abstract, but that's on purpose. With some imagination, you can use Barrel to work with timed event sequences of any kind: a dancing hamster on a web page, a loading animation, or a Node.js-ignited firework display.
