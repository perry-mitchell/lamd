(function(root) {

	"use strict";

	var lamd = root.lamd,
		__define = lamd.define,
		__require = lamd.require;

	var __timeout = 500, // timeout in ms
		NOOP = function() {};

	function waitForRequirementAndTimeout(requirement) {
		var hasDefined = false;
		__require(requirement, function(r) {
			hasDefined = true;
		});
		setTimeout(function() {
			if (!hasDefined) {
				throw new Error("A timeout occurred while waiting for a requirement to be defined: " + requirement);
			}
		}, __timeout);
	}

	lamd.setDefineTimeout = function(ms) {
		__timeout = ms;
	};

	lamd.define = function() {
		if (arguments.length === 3) {
			// Full define with requirements, start timeout
			var requirements = arguments[1];
			if (typeof requirements === "string") {
				requirements = [requirements];
			}
			requirements.forEach(waitForRequirementAndTimeout);
		}
		__define.apply(undefined, arguments);
	};

	lamd.require = function() {
		var requirements = arguments[0];
		if (typeof requirements === "string") {
			requirements = [requirements];
		}
		requirements.forEach(waitForRequirementAndTimeout);
		return __require.apply(undefined, arguments);
	}

})(this || window);
