describe("define", function() {

	"use strict";

	it("defines modules", function(done) {
		define("test/1", function() {
			return 5;
		});
		require("test/1", function(item) {
			expect(item).toBe(5);
			(done)();
		});
	});

	it("handles requirements in correct order", function(done) {
		define("test/4", ["test/2", "test/3"], function(two, three) {
			expect(two).toBe(10);
			expect(three).toBe(40);
			(done)();
		});
		define("test/2", function() { return 10; });
		define("test/3", 40);
	});

});
