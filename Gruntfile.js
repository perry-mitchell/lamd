module.exports = function(grunt) {

	"use strict";

	grunt.initConfig({
		jasmine: {
			all: {
				src: [
					"node_modules/setimmediate/setimmediate.js",
					"node_modules/promise-polyfill/Promise.js",
					"source/lamd.js"
				],
				options: {
					specs: "tests/specs/**/*.js"
				}
			}
		}
	});

    // Grunt package init
    require('load-grunt-tasks')(grunt, { pattern: ['grunt-*'] });

    grunt.registerTask("test", ["jasmine:all"]);

};