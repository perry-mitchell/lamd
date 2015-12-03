describe("lamd + timeout", function() {

	"use strict";

	var __oldError,
		ErrorMock;

	beforeEach(function() {
		__oldError = Error;
		Error = ErrorMock = function(err) {
			ErrorMock.lastError = err;
		};
		ErrorMock.prototype.toString = function() { return ""; };
	});

	afterEach(function() {
		Error = __oldError;
	});

	it("throws an exception (require)", function(done) {
		lamd.setDefineTimeout(100);
		lamd.require("not-here", function() {});
		setTimeout(function() {
			expect(ErrorMock.lastError.indexOf("Requirements did not fulfill")).toBeGreaterThan(-1);
			(done)();
		}, 130);
	});

	it("throws an exception (define)", function(done) {
		lamd.setDefineTimeout(100);
		lamd.define("test-name", "not-here", function() {});
		setTimeout(function() {
			expect(ErrorMock.lastError.indexOf("Requirements did not fulfill")).toBeGreaterThan(-1);
			(done)();
		}, 130);
	});

});
