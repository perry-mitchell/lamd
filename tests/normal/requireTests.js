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

	it("returns a promise (resolve 1 dependency)", function(done) {
		lamd.define("test/require/3", 3);
		lamd.require("test/require/3")
			.then(function(three) {
				expect(three).toBe(3);
			})
			.then(done);
	});

	it("returns a promise (resolve n dependencies)", function(done) {
		lamd.define("test/require/4", function() { return 4; });
		lamd.require(["test/require/4", "test/require/5"])
			.then(function(items) {
				expect(items[0]).toBe(4);
				expect(items[1]).toBe(5);
			})
			.then(done);
		lamd.define("test/require/5", function() { return 5; });
	});

});
