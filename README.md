# lamd
Local Asynchronous Module Definition library

[![Build Status](https://travis-ci.org/perry-mitchell/lamd.svg)](https://travis-ci.org/perry-mitchell/lamd)

[![NPM](https://nodei.co/npm/lamd.png)](https://nodei.co/npm/lamd/)

## About

lamd is an "offline" AMD implementation, designed to provide `require` and `define` methods for a local set of modules. `require` makes no remote calls, and expects everything to be defined by the corresponding `define` method.

lamd uses simple wrapper functions, along with setImmediate, to execute dependency factories and callbacks with decent performance (it used to use Promises). No timers or intervals are used, unless setImmediate is not available (make sure to polyfill for best performance!).

### Why?

lamd was built as a result of experiences while working at [Kiosked](http://kiosked.com) - Kiosked's front-end script bundles its entire library for delivery to the client, and makes use of AMD to define its modules. Because no modules are requested from remote sources, a clean form of local-style AMD was required.

## Usage

### define

You can define a module by doing the following:

	define("my-module", function() {
		return {
			myMethod: function() {
				return true;
			}
		};
	});

	// or, for example:

	define("my-module", ["my-dependency"], function(dep) {
		return function() {
			return dep();
		};
	});

`define`'s method signature is `define(id[, dependencies], callback)`, where:

 * `id` is the ID of the module, which is required
 * `dependencies` is an _optional_ string or array or dependent module IDs
 * `callback` is a required callback function which takes the dependent module outputs as parameters

### require

`require` can be viewed as the same as the `define` method, but without an ID.

`require`'s method signature is `require(dependencies[, callback])`, where:

 * `dependencies` is a string or array of required module outputs
 * `callback` is a callback function which takes the required dependency outputs as parameters

`require` can return the defined module instance if it's ready: simply require **only 1** module and do not provide a callback:

	var MyModule = require("MyModule");

`require` will return `undefined` if the module is not ready. Remember that `define` works asynchronously.

## Using this library

lamd writes `lamd` to the global object (or current context), so you can access its methods like so:

	lamd.define 		// Function
	lamd.require 		// Function
	lamd.setImmediate   // Function

lamd's `setImmediate` may resolve to `setTimeout(fn, 0)` if a setImmediate polyfill is not available. I recommend using [this one by YuzuJS](https://github.com/YuzuJS/setImmediate).
