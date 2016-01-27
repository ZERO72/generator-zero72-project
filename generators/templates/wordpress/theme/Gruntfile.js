// All the JS files to be compiled for acceptance and production. NOT: Be sure that this is the same list of files as in includes/javascript-loader.php
var javascriptFiles = [

	// Node modules

	// Libraries
	"assets/js/libs/swiper.min.js",
	"assets/js/libs/pikaday.min.js",
	"assets/js/libs/moment.min.js",
	"node_modules/jquery/dist/jquery.js",

	// Project JS files
	"assets/js/main.js",
	"assets/js/helpers/mainHelper.js",
	"assets/js/acf-google-maps-streetview.js"

];

module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		banner: '/*! <%%= pkg.title || pkg.name %> - v<%%= pkg.version %> - ' +
		'<%%= grunt.template.today("yyyy-mm-dd") %>\n' +
		'<%%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
		'* Copyright (c) <%%= grunt.template.today("yyyy") %> <%%= pkg.author.name %> */\n',
		// Task configuration.
		sass: {
			production: {
				options: {
					outputStyle: 'compressed',
					sourceMap: false
				},
				files: {
					'style.css' : 'assets/scss/main.scss',
					'assets/css/wp-admin-overrides.css' : 'assets/scss/backend.scss'
				}
			},
			dev: {
				options: {
					outputStyle: 'nested',
					sourceMap: true
				},
				files: {
					'style.css' : 'assets/scss/main.scss',
					'assets/css/wp-admin-overrides.css' : 'assets/scss/backend.scss'
				}
			}
		},

		concat: {
			options: { "separator": "\n" },
			production: {
					src: javascriptFiles,
					dest: "tmp/app-concat.js"
			}
		},
		ngAnnotate: {
			options: {
				singleQuotes: true
			},
			production:{
				files: {
					'tmp/ngannotate.js': ['tmp/app-concat.js']
				}
			}
		},
		uglify: {
			options: {
				banner: '<%%= banner %>',
				mangle: false
			},
			production: {
				src: "tmp/ngannotate.js",
				dest: 'scripts.js'
			}
		},

		watch: {
			options: {
				livereload: 5555
			},
			html: {
				files: [
					'*.html',
					'*.php',
					'**/*.html',
					'**/*.php'
				]
			},
			scripts: {
				files: [
					'Gruntfile.js',
					'app/*.js',
					'app/**/*.js',
					'assets/*.js',
					'assets/*/**.js',
					'assets/js/helpers/*.js',
					'assets/js/controllers/*.js'
				],
				tasks: ['jshint']
			},
			css: {
				files: ['assets/scss/*.scss', 'assets/scss/*/**.scss'],
				tasks: ['sass:dev'],
				options: {
					spawn: false
				}
			}
		},
		jshint: {
			all: [
				'Gruntfile.js',
				'app/*.js',
				'app/*/**.js'
			]

		},

		pot: {
			options: {
				text_domain: 'ets-football',
				dest: 'languages/',
				keywords: ['gettext', '__', '_e']
			},
			files: {
				src: ['*.php', 'includes/**/*.php'],
				expand: true
			},
		},

	});


	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-processhtml');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-ng-annotate');
	grunt.loadNpmTasks('grunt-pot');

	// Default task. Use this for development.
	grunt.registerTask('default', ['sass:dev', 'jshint', 'watch']);
	grunt.registerTask('dev', ['sass:dev', 'jshint', 'watch']);

	// Translation task
	grunt.registerTask('makepot', ['pot']);

	// Production task
	grunt.registerTask('production', ['sass:production', 'concat:production', 'ngAnnotate:production', 'uglify:production']);

};