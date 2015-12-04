describe("setImmediate", function() {

	"use strict";

	it("executes functions", function(done) {
		expect(lamd.setImmediate).toBeDefined();
		lamd.setImmediate(done);
	});

});
