describe("Global environment", function() {

	"use strict";

	it("is not polluted", function() {
		var globalDefine = window && window["define"],
			globalRequire = window && window["require"];
		expect(lamd.define).not.toEqual(globalDefine);
		expect(lamd.require).not.toEqual(globalRequire);
	});

});