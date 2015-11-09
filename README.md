# lamd
Local Asynchronous Module Definition library

[![Build Status](https://travis-ci.org/perry-mitchell/lamd.svg)](https://travis-ci.org/perry-mitchell/lamd)

## About

lamd is an "offline" AMD implementation, designed to provide `require` and `define` methods for a local set of modules. `require` makes no remote calls, and expects everything to be defined by the corresponding `define` method.

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

`define`'s method signature is `define(id, [dependencies,] callback)`, where:

 * `id` is the ID of the module, which is required
 * `dependencies` is an _optional_ string or array or dependent module IDs
 * `callback` is a required callback function which takes the dependent module outputs as parameters

### require

`require` can be viewed as the same as the `define` method, but without an ID.

`require`'s method signature is `require(dependencies, callback)`, where:

 * `dependencies` is a string or array of required module outputs
 * `callback` is a callback function which takes the required dependency outputs as parameters

## Using this library

lamd writes to global if `require` is not defined. lamd also writes `lamd` to global, which contains the two methods:

	lamd.define 		// Function
	lamd.require 		// Function

