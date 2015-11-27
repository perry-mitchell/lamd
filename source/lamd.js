/**
 * LAMD - Local Asynchronous Module Definition
 * AMD-style requires and defines for bundled libraries.
 * @license MIT
 * @author Perry Mitchell
 * @module lamd
 */
(function(root, factory) {

    "use strict";

    if (typeof module === "object" && module.exports) {
        module.exports = root.lamd;
    } else {
        root.lamd = (factory)();
    }

})(this || window, function() {

	"use strict";

	var __modules = {};

	/**
	 * Define a module:
	 * 	eg. define("namespace/my-module", ["some-requirement"], function(RequirementInstance) { ...
	 * @param {String} moduleName The name of the module
	 * @param {Array|String} requirements The requirement name, or an array of requirement names
	 * @param {Function|*} factory A factory function or value for the definition. If it's a function,
	 *		it is executed and the value is set to the module itself. If it's another type, it is simply
	 * 		set to the module. 'undefined' values, either by return value of the factory or input to the
	 *		define method, are considered erroneous and will throw.
	 * @returns {Promise} A promise that resolves with an array of satisfied dependencies
	 */
	function define(/* moduleName[, requirements], factory */) {
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
		var module = __modules[id] = __modules[id] || { id: id, def: false, output: undefined };
		if (module.def !== false) {
			throw new Error("Module already defined: " + id);
		}
		module.factory = factory;
		module.def = true;
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

	/**
	 * A module object
	 * @typedef {Object} LAMDModule
	 * @property {String} id - The id of the module
	 * @property {Function|Object|undefined|*} output - The generated output of the module's factory
	 * @property {Function|*} factory - The factory for the module
	 * @property {Boolean} def - Whether the module has been defined or not
	 * @property {Function[]=} waitList - An array of dependencies (resolution functions)
	 */

	/**
	 * Check if a module is ready (defined)
	 * @param {LAMDModule|String} moduleOrID The module or ID to check
	 */
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
		var module = __modules[moduleID] = __modules[moduleID] || { id: moduleID, def: false, output: undefined };
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

    var lib = {
        define: define,
        require: require
    };

	// AMD standard requires a define.amd property
	// available in the define object
	// https://github.com/amdjs/amdjs-api/wiki/AMD
	lib.define.amd = {};

    return lib;

});
