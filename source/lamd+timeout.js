(function(root) {

	"use strict";

	var lamd = root.lamd,
		__define = lamd.define,
		__require = lamd.require;

	var __timeout = 500, // timeout in ms
		NOOP = function() {};

	function waitForRequirementsAndTimeout(requirements, forModule) {
		forModule = forModule || "(empty)";
		var requirementStates = {};
		requirements.forEach(function(req) {
			requirementStates[req] = false;
		});
		requirements.forEach(function(requirement) {
			__require(requirement, function() {
				requirementStates[requirement] = true;
			});
		});
		setTimeout(function() {
			var failedRequirements = [];
			for (var requirement in requirementStates) {
				if (requirementStates.hasOwnProperty(requirement) && !requirementStates[requirement]) {
					failedRequirements.push(requirement);
				}
			}
			if (failedRequirements.length > 0) {
				throw new Error("Requirements did not fulfill for '" + forModule + "': " + failedRequirements.join(", "));
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
			waitForRequirementsAndTimeout(requirements, arguments[0]);
		}
		__define.apply(undefined, arguments);
	};

	lamd.require = function() {
		var requirements = arguments[0];
		if (typeof requirements === "string") {
			requirements = [requirements];
		}
		waitForRequirementsAndTimeout(requirements);
		return __require.apply(undefined, arguments);
	}

})(this || window);
