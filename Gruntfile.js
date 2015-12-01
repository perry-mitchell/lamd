module.exports = function(grunt) {

	"use strict";

	grunt.initConfig({
		jasmine: {
			normal: {
				src: [
					"node_modules/setimmediate/setimmediate.js",
					"node_modules/promise-polyfill/Promise.js",
					"source/lamd.js"
				],
				options: {
					specs: "tests/normal/**/*.js"
				}
			},
			timeout: {
				src: [
					"node_modules/setimmediate/setimmediate.js",
					"node_modules/promise-polyfill/Promise.js",
					"source/lamd.js",
					"source/lamd+timeout.js"
				],
				options: {
					specs: "tests/timeout/**/*.js"
				}
			}
		}
	});

    // Grunt package init
    require('load-grunt-tasks')(grunt, { pattern: ['grunt-*'] });

    grunt.registerTask("test", ["jasmine:all"]);

};