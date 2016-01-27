/*

Project Name: ZERO72 project generator
Project Description: Scaffolding tool, based off of Yeoman, for ZERO72.
Project Date: February 2016
Project Author: Coen Koopmans <coen@zero72.com>

Built in co-operation with ZERO72 and the University of Applied Sciences of Amsterdam, 
Communication & Multimedia Design.

Copyright 2016 ZERO72 B.V. & Coen Koopmans. Licensed under The MIT License.
See LICENSE.txt for full license.

*/

'use strict'; // This throws errors sooner than would be the case normally. Good practice.

// Include all the node modules! (And assign them a variable for later use.)
var generators = require('yeoman-generator'),
	mkdirp = require('mkdirp'),
	yosay = require('yosay'),
	chalk = require('chalk'),
	ejs = require('ejs'),
	extfs = require('extfs'),
	rimraf = require('rimraf'),
	glob = require('glob'),
	package_json = require('../package.json');

// mkdirp, extfs, rimraf, glob added for more flexbility in working with the file system.
// (Especially synchronously, so things can be accomplished that one can't normally with Yeoman.)

// Global scope settings
var settings = {
	// For use in log messages
	separator: "=======================================================================",
	// Not in scope at the moment, will be set in the constructor phase
	targetFolder: "",
	// Not in scope at the moment, will be set in the initializing phase
	sourceFolder: "",
	// Is the target folder empty? Will be checked and set.
	targetFolderEmpty: true,
	// Should the target folder be emptied before editing the file system?
	clearTargetFolder: false,
	// Get the version number from package.json
	version: package_json.version
};

// Define the Yeoman generator.
module.exports = generators.Base.extend({

/*
#############################################################################
###                                                                       ###
### PRIVATE METHODS                                                       ###
### Will NOT be called automatically. (Due to prefixing with underscore.) ###
###                                                                       ###
#############################################################################
*/

	// Get multiple project types as a string
	_getProjectTypes: function(returnAsArray) {
		// Get the types from the project-types.json file.
		var projectTypes = require('./project-types.json');

		// Check if we simply need the array (the arg is true), if so, return right away
		if(returnAsArray) {
			return projectTypes.types;
		}

		// Start a var for string creation
		var typesString = "";

		// Loop through valid types, add them to string
		for(var i = 0; i < projectTypes.types.length; i++) {
			typesString += chalk.bgBlue(projectTypes.types[i]);

			// If not the last one in the list, add a comma and a space.
			if( (i+1) < projectTypes.types.length ) {
				typesString += ", ";
			}
		}
		return typesString;
	},

	_checkProjectType: function() {
		// Check required argument
		if(this.projectType) {
			// Project type given, check validity. Does the type exist in the definition?
			var projectTypes = this._getProjectTypes(true);
			var foundProjectType = false;
			// Check all the types for a match with the given argument.
			for(var i=0; i<projectTypes.length;i++) {
				if(projectTypes[i] == this.projectType) {
					foundProjectType = true;
				}
			}


			if(foundProjectType !== true) {
				// Project type not found in list
				var projectTypeError = 
					chalk.white.bold("Hi there! \n") +
					chalk.white.bgRed("It seems the project type you have given, \"" + chalk.bold.underline(this.projectType) + "\", is invalid. \n") +
					"The following types are available: " + this._getProjectTypes() + "\n" +
					chalk.bold("You can also use $ \"yo zero72-project --help\"")
				;
				this.log(yosay(projectTypeError));
				// Exit node, stop execution
				process.exit(1);
			}
		}
		else {
			// No project type arg given: show (pretty) error
			var projectTypeError = 
				chalk.white.bold("Hi there! \n") +
				chalk.white.bgRed("It seems you forgot the mandatory argument for project type. \n") +
				"You can use it like this: $ \"yo zero72-project plain\" \n" +
				"The following types are available: " + this._getProjectTypes() + "\n" +
				"You can also use $ \"yo zero72-project --help\" "
			;
			this.log(yosay(projectTypeError));
			process.exit(1);
		}
	},

	_clearTargetFolder: function() {
		// Inform user that the target folder is being cleared.
		this.log(settings.separator);
		this.log(chalk.black.bgWhite("Clearing target folder, just like you asked..."));
		this.log(settings.separator);

		// Get target folder contents, remove them all
		var targetFolderContents = extfs.readdirSync(settings.targetFolder);
		for(var i=0;i<targetFolderContents.length;i++) {
			var toRemove = settings.targetFolder + '/' + targetFolderContents[i];
			this.log(chalk.green("Removing: ") + toRemove);
			//extfs.removeSync( toRemove );
			rimraf.sync( toRemove );
		}

		// Inform the user that clearing is completed (for debug purposes).
		this.log(settings.separator);
		this.log(chalk.black.bgWhite("Target folder cleared."));
		this.log(settings.separator + "\n");
	},

	_createProjectFileSystem: function() {

		// Check if the target folder should be cleared beforehand.
		if( settings.clearTargetFolder ) {
			this._clearTargetFolder();
		}

		// Make folders
		this.log(settings.separator);
		this.log(chalk.black.bgWhite("Setting up file system as per instructions from filesystem.json..."));
		this.log(settings.separator);

		// Prepare compiled template
		var input = settings.sourceFolder + '_setup/filesystem.json';
		var tempFile = settings.sourceFolder + '_setup/filesystem-compiled.json';

		this.fs.copyTpl(input, tempFile, this.answers);

		// Call file system creation
		this._createFileSystemFromFile( tempFile );

		// Remove compiled template
		this.fs.delete( tempFile );

		this.log(settings.separator);
		this.log(chalk.black.bgWhite("File system setup done.") + " Full list of files written to disk below.");
		this.log(settings.separator);
	},

	_createFileSystemFromFile: function(inputFile) {
		// Setup vars for recurring items
		var structure = this.fs.readJSON(inputFile);
		var root = structure.root;
		var destRoot = settings.targetFolder + '/';
		var srcRoot = settings.sourceFolder;
		var self = this;

		// Bind prompt answers to template context
		var templateContext = this.answers;

		// Object with options for node-glob (https://github.com/isaacs/node-glob#options)
		// Used to include hidden files, but exclude OS native files, such as .DS_Store on Mac
		var globOptions = {
			dot: true,
			ignore: [
				'**/.DS_Store', // Mac folder settings
				'.DS_Store',
				'**/Thumbs.db', // Windows thumbnail cache
				'Thumbs.db',
			]
		};

		// Call recursive function that will "walk" through the file system
		walk(root, '');

		// Items are JS(ON) objects within filesystem setup, 
		// scope is an optional subfolder of the destination root (give empty string for root)
		function walk(items, scope) {
			// Top-level folders
			for( var i = 0; i < items.length; i++ ) {
				// Check if folder (or file)
				if( items[i].type == "folder" ) {

					// If the property "source" is given, copy folder from somewhere
					// If it is not, create it.
					if( !items[i].source ) {
						// Create folder, show message
						self.log( chalk.green("Creating folder:") + ' ' + destRoot + scope + items[i].name );
						mkdirp(destRoot + scope + items[i].name);
					}
					else {
						// Just copy everything in there over to the given destination.
						var source = items[i].source;
						var destination = scope + items[i].name;
						self.log(chalk.green("Copying folder from:") + " " + source );
						self.log(chalk.green("Copying folder to:") + " " + destination );
						
						// Should template tags be evaluated? Yeoman provides different functions for evaluating these and not doing so.
						// Default is true, if "false" given (as expression, not as string) skip templating.
						if( items[i].template === false ) {
							// First, simply copy the entire folder (including all files contained)
							self.fs.copy( srcRoot + source, destRoot + destination, globOptions );
							// Now, check for dotted files (hidden files, such as .gitignore) recursively, return with glob.
							// Then, paste into destination
							self.fs.copy( srcRoot + source + '/**/.*', destRoot + destination, globOptions );
						}
						else {
							// The above is slightly trickier for templated folders:
							// The glob must be performed first.
							var globSrc = glob.sync( srcRoot + source, globOptions );
							// Also, the glob can turn up empty, resulting in a crash.
							if( Array.isArray( globSrc ) && globSrc.length > 0 ) {
								self.fs.copyTpl( globSrc, destRoot + destination, templateContext );
							}

							globSrc = glob.sync( srcRoot + source + '/**/.*', globOptions );
							if( Array.isArray( globSrc ) && globSrc.length > 0 ) {
								self.fs.copyTpl( globSrc, destRoot + destination, templateContext );
							}
						}
					}
					// Check if recursion needs to be incurred.
					if( items[i].children ) {
						// Call the function unto itself
						walk(items[i].children, scope + items[i].name + '/' );
					}
				}
				else if( items[i].type == "file" ) {
					// Copy file...
					self.log(chalk.green("Copying file from:") + " " + srcRoot + items[i].source );
					self.log(chalk.green("Copying file to: ") + " " + destRoot + scope + items[i].name );
					
					// Should template tags be evaluated? Yeoman provides different functions for evaluating these and not doing so.
					// Default is true, if "false" given (as expression, not as string) skip templating.
					if( items[i].template === false ) {
						self.fs.copy( srcRoot + items[i].source, destRoot + scope + items[i].name, globOptions );
					}
					else {
						self.fs.copyTpl( srcRoot + items[i].source, destRoot + scope + items[i].name, templateContext );
					}
				}
			}
		}
	},

	_getPrompts: function() {

		// Get prompts from proper folder
		var file = require(settings.sourceFolder + '_setup/prompts.js');
		// Get the content of the prompts for insertion into Inquirer.js.
		// By executing the function given to us by prompts.js.
		var prompts = file();

		if(!settings.targetFolderEmpty) {
			// Add question about emptying target folder at the start
			var targetFolderPrompt = {
				"name": "target_folder_empty",
				"message": "Attention! Your target folder is not empty. Should I empty it before generating your project? (Warning: this cannot be undone.)",
				"type": "confirm"
			};
			// The unshift method (included in the prototype of every array) adds an item at the front of the array.
			prompts.unshift(targetFolderPrompt);
		}

		// Check if optional node_modules are defined in npm.json, if so, add them to the end of prompts listing.
		if(settings.npmListing.optional.length) {
			// Set up prompt
			var npmPrompt = {
				"name": "npm",
				"type": "checkbox",
				"message": "Which of these NPM modules would you like to include?",
				"choices": settings.npmListing.optional
			};
			// Add to array
			prompts.push(npmPrompt);
		}

		return prompts;
	},

	// Help save the answers. In a separate function to facilitate async operations.
	_savePromptAnswers: function(answers, callback) {
		// Bind the answers to the generator.
		this.answers = answers;

		// Check if target_folder_empty is a defined answer
		if("target_folder_empty" in answers) {
			// If so, we need to deal with it (later on) in this file.
			// Thus, we save the setting for now in our global settings object.
			settings.clearTargetFolder = answers.target_folder_empty;
		}

		// Now, the callback can be fired so the application can continue.
		callback();
	},

	// Check if a directory is empty
	_isEmptyDirectory: function(path_string) {
		// Use node glob to check every file directly inside the folder.
		// Ignores DS_Store and Thumbs.db.
		var found = glob.sync(path_string + '/*', {
			dot: true,
			ignore: [
				'**/.DS_Store',
				'**/Thumbs.db'
			]
		});

		// The glob command will return an empty array if the folder is empty.
		return found.length == 0;
	},

	_isDirectory: function(path_string) {
		// Use the node.fs native function lstat to check for directory existance.
		// Since extfs is an EXTension of the FileSystem,
		// These native functions are available under it as well.
		return extfs.lstatSync(path_string).isDirectory();
	},


	_getNpmListing: function() {
		// Find npm.json
		var file = settings.sourceFolder + '_setup/npm.json';
		// Include it
		var contents = require(file);
		// Only map the actual module names on here
		var listing = {
			mandatory: contents.mandatory,
			optional: contents.optional
		};
		// Set to global setting
		settings.npmListing = listing;
	},

/*
#############################################################################
###                                                                       ###
### PUBLIC METHODS (Run loop)                                             ###
### Will be called automatically.                                         ###
###                                                                       ###
#############################################################################
*/


	// Overrides Yeoman default constructor
	constructor: function() {
		// Call Yeoman default constructor before performing our own actions.
		// arguments is a reserved keyword in this context
		generators.Base.apply(this, arguments);

		// Set target folder
		settings.targetFolder = this.destinationRoot();
		
		var projectTypeArgDescription = "What type of project will you be setting up? Valid types: ";
		projectTypeArgDescription += this._getProjectTypes();

		// Adds argument to "this" on the generator. (the string given as first arg will be used: this.argument("string") -> this.string)
		// First argument (not option, use this.option() for that) to be saved
		this.argument("projectType", {
			required: false, // Yeoman throws an ugly error if we make this required, instead we will handle the error ourselves if this is not given.
			type: String,
			desc: projectTypeArgDescription
		});
	},

	// Boot up the project, say hello, etc.
	initializing: function() {

		// First, we need a project type. It changes everything that follows.
		this._checkProjectType();

		// Set source folder globally
		settings.sourceFolder = this.sourceRoot() + '/' + this.projectType + '/';

		// Setup NPM listing var for later.
		this._getNpmListing();

		// Greet the user.
		var message = chalk.bold("Welcome to the ZERO72 project generator. ") + chalk.green("version " + settings.version );
		this.log(yosay(message));

		// Inform the user of project type.
		this.log(settings.separator);
		this.log( chalk.black.bgWhite("Using project type:") + " " + chalk.white.bgCyan.bold(this.projectType) );
		this.log(settings.separator);
		this.log("\n");

		// Check & set whether the target folder is empty. Then, print contents (if applicable)
		if(!this._isEmptyDirectory(settings.targetFolder)) {
			settings.targetFolderEmpty = false;
			
			this.log(settings.separator);
			this.log(chalk.black.bgWhite("Target folder contents:"));
			this.log(settings.separator);

			// Gets folder contents, one level deep. Ignores DS_Store and Thumbs.db.
			var contents = glob.sync(settings.targetFolder + '/*', {
				dot: true,
				mark: true, // Adds slashes to the end of folder names, e.g.: "folder/"
				ignore: [
					'**/.DS_Store',
					'**/Thumbs.db'
				]
			});
			//var contents = extfs.readdirSync(settings.targetFolder);
			for(var i=0; i<contents.length; i++) {
				// Glob returns the full file path, we only need one relative to the output folder
				contents[i] = contents[i].replace(settings.targetFolder + "/", "");
				this.log(contents[i]);
			}
			// We are NOT reading the target folder recursively. (For a number of reasons.) We need to make sure to explain this.
			this.log(settings.separator);
			this.log("** This list may include folders that have their own contents. Only the topmost level is displayed. **");
			this.log(settings.separator);
		}
		else {
			settings.targetFolderEmpty = true;
		}

	},

	// Get the prompts answered!
	prompting: function() {
		// When done() is called, the async event will complete/fire.
		var done = this.async();

		// Yeoman stock function for prompts.
		this.prompt(this._getPrompts(), 
		// Callback for prompt function.
		function(answers) {
			// Put this in a private method for cleanliness. Does all the legwork.
			this._savePromptAnswers(answers, done);
		}.bind(this));
	},

	// Call the (rather large) function for creating the file system in target dir from instructions in _setup...
	writing: function() {
		this._createProjectFileSystem();
	},

	// After setting up file system, install dependencies.
	install: function() {

		this.log(settings.separator);
		this.log(chalk.black.bgWhite("Performing NPM install..."));
		this.log(settings.separator);

		// Build a queue, as npmInstall can only be called once in Yeoman
		var modules = [];

		if( settings.npmListing.mandatory.length ) {
			// Add mandatory modules to queue
			for(var i=0;i<settings.npmListing.mandatory.length;i++) {
				modules.push(settings.npmListing.mandatory[i]);
			}
		}

		// Install optional modules
		if(this.answers.npm ) {
			// Do an NPM install
			// Yeoman native function for NPM install.
			for(var i=0;i<this.answers.npm.length;i++) {
				modules.push(this.answers.npm[i]);
			}
		}

		// List modules to be installed
		this.log(chalk.bold("Modules to be installed:"));
		for(var i=0; i<modules.length; i++) {
			this.log(modules[i]);
		}

		this.log(chalk.dim.italic("Debug note: warnings are supressed due to the --silent option."));

		// Perform install
		this.npmInstall(modules, { 'saveDev': true, 'silent': true });

		this.log(settings.separator);
	},

	// Say bye! Make sure it is abundantly clear the program has finished without problems.
	end: function() {

		var message = chalk.green.bold("Everything seems to have gone ok. ") + chalk.white("Thank you!");
		this.log(yosay(message));
	}
});