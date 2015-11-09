describe("require", function() {

	"use strict";

	it("requires modules", function(done) {
		lamd.define("test/require/1", function() {
			return 99;
		});
		lamd.define("test/require/2", ["test/require/1"], function(one) {
			return function() {
				return one + 1;
			};
		});
		lamd.require(["test/require/1", "test/require/2"], function(one, two) {
			expect(one).toBe(99);
			expect(two()).toBe(100);
			(done)();
		});
	});

});
