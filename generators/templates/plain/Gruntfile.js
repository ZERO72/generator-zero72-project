var jsFiles = [
	
	"assets/js/scripts.js"

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
			prod: {
				options: {
					outputStyle: 'compressed',
					sourceMap: false
				},
				files: {
					'dist/assets/stylesheets/css/style.css' : 'app/assets/stylesheets/scss/main.scss'
				}
			},
			dev: {
				options: {
					outputStyle: 'nested',
					sourceMap: true
				},
				files: {
					'app/assets/stylesheets/css/style.css' : 'app/assets/stylesheets/scss/main.scss'
				}
			}
		},

		jshint: {
			all: [
				'Gruntfile.js',
				'app/app/*.js',
				'app/app/*/**.js'
			]

		},

		processhtml: {
			options: {
				strip: true
			},
			build: {
				files: [
					{
					'dist/index.html': ['app/index.html']
					}
				]
			}
			
		},

		concat: {
			options: { "separator": "\n" },
			production: {
					src: jsFiles,
					dest: "tmp/app-concat.js"
			}
		},

		uglify: {
			options: {
				banner: '<%%= banner %>',
				mangle: false
			},
			production: {
				src: "tmp/app-concat.js",
				dest: 'dist/assets/js/app.min.js'
			}
		},

		copy: {
			main: {
				files: [

					{
						expand: true,
						cwd: 'app/app',
						src: ['**'],
						dest: 'dist/app'
					},

					{
						expand: true,
						cwd: 'app/assets/img',
						src: ['**'],
						dest: 'dist/assets/img'
					}

				]
			}
		},

		watch: {
			options: {
				livereload: 5555
			},
			html: {
				files: [
					'app/index.html',
					'app/**/*.html',
					'app/*.html'
				],
				tasks: ['processhtml']
			},
			scripts: {
				files: [
					'Gruntfile.js',
					'app/*.js',
					'app/**/*.js',
					'assets/*.js',
					'assets/**/*.js'
				],
				tasks: ['jshint']
			},
			css: {
				files: ['app/assets/stylesheets/scss/*.scss', 'app/assets/stylesheets/scss/*/**.scss', 'app/assets/stylesheets/scss/**/**/*.scss'],
				tasks: ['sass:dev'],
				options: {
					spawn: false
				}
			}
		}

	});


	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-processhtml');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-copy');

	// Default task.
	grunt.registerTask('default', ['sass:dev', 'jshint', 'watch']);

	// Production build task
	grunt.registerTask('build', ['sass:prod', 'jshint', 'processhtml', 'concat', 'uglify', 'copy']);
};