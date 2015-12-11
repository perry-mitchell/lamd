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

	it("returns the module if already defined", function(done) {
		expect(lamd.require("test/require/3")).toBe(undefined);
		lamd.define("test/require/3", 10);
		setTimeout(function() {
			expect(lamd.require("test/require/3")).toBe(10);
			(done)();
		}, 60);
	});

	it("waits for multiple modules", function(done) {
		lamd.define("test/require/4", 10);
		lamd.define("test/require/5", 15);
		setTimeout(function() {
			expect(lamd.require(["test/require/4", "test/require/5"], function() {})).toBe(undefined);
			(done)();
		}, 30);
	});

	it("executes the callback with no requirements", function(done) {
		lamd.require([], function() {
			expect(arguments.length).toBe(0);
			(done)();
		});
	});

});
