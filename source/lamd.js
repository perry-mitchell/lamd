var lamd = {};
(function(lib) {

	"use strict";

	var __modules = {};

	function define() {
		var argsLen = arguments.length,
			id,
			factory = null,
			requirements = [];
		if (argsLen === 2) {
			factory = arguments[1];
		} else if (argsLen === 3) {
			requirements = arguments[1];
			factory = arguments[2];
		} else {
			throw new Error("Invalid number of arguments");
		}
		id = arguments[0];
		var module = __modules[id] = __modules[id] || { id: id, output: undefined };
		module.factory = factory;
		return require(requirements, function() {
			var satisfactions = Array.prototype.slice.call(arguments);
			if (typeof module.factory === "function") {
				module.output = module.factory.apply(module.factory, satisfactions);
			} else {
				module.output = module.factory;
			}
			if (module.output === undefined) {
				throw new Error("Module factory output cannot be undefined");
			}
			(module.waitList || []).forEach(function(resolutionFn) {
				(resolutionFn)();
			});
		});
	}

	function moduleReady(moduleOrID) {
		if (typeof moduleOrID === "string") {
			moduleOrID = __modules[moduleOrID] || null;
		}
		return (moduleOrID && moduleOrID.output !== undefined);
	}

	function require(requirements, fn) {
		requirements = (typeof requirements === "string") ? [requirements] : requirements;
		return waitForModules(requirements)
			.then(function(satisfactions) {
				fn.apply(null, satisfactions.map(function(satisfaction) {
					return satisfaction.output;
				}));
			});
	}

	function waitForModule(moduleID) {
		var module = __modules[moduleID] = __modules[moduleID] || { id: moduleID, output: undefined };
		return new Promise(function(resolve) {
			if (moduleReady(moduleID)) {
				(resolve)(module);
			} else {
				(module.waitList = module.waitList || []).push(function() {
					(resolve)(module);
				});
			}
		});
	}

	function waitForModules(moduleIDs) {
		var satisfactions = [];
		return Promise
			.all(
				moduleIDs
					.map(function(moduleID) {
						return waitForModule(moduleID)
							.then(function(module) {
								satisfactions[moduleIDs.indexOf(module.id)] = module;
							});
					})
			)
			.then(function() {
				return satisfactions;
			});
	}

	lib.define = define;
	lib.require = require;

})(lamd);

if (typeof require === "undefined") {
	var define = lamd.define,
		require = lamd.require;
}
if (module) {
	module.exports = lamd;
}
