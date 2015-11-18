describe("define", function() {

	"use strict";

	it("defines modules", function(done) {
		lamd.define("test/1", function() {
			return 5;
		});
		lamd.require("test/1", function(item) {
			expect(item).toBe(5);
			(done)();
		});
	});

	it("handles requirements in correct order", function(done) {
		lamd.define("test/4", ["test/2", "test/3"], function(two, three) {
			expect(two).toBe(10);
			expect(three).toBe(40);
			(done)();
		});
		lamd.define("test/2", function() { return 10; });
		lamd.define("test/3", 40);
	});

	it("has `amd` property", function() {
		expect(!!lamd.define.amd).toBe(true);
		expect(typeof lamd.define.amd).toBe("object");
	});

});
