/*
These prompts will be given directly to Inquirer.js. <https://github.com/SBoudrias/Inquirer.js/>
Everything available there will work here. (Make sure your node_modules are updated though!)

The answers to these prompts will be available through EJS <http://ejs.co>
The main use for this is outputting answers in the template you are building.
They can even be used in filesystem.json. (For dynamic filenames.)

Please only edit the contents of var prompts.

This file is .js instead of .json so you can include function callbacks; JSON is only meant for data storage. (Such as filesystem.json)

See npm.json to add modules.
*/

var prompts = [
	{
		name: "name",
		message: "What is your project name? (This will be used in package.json, please don't use spaces.)",
		default: "zero72-project",
		validate: function(input) {
			// Check whether the name contains spaces. If so, return false. Else, return error
			if( input.indexOf(' ') >= 0 ) {
				return "No spaces please.";
			}
			else {
				return true;
			}
		}
	},
	{
		name: "title",
		message: "What is your project title? (Long name, with spaces. To be used in e.g. <title>).",
		default: "ZERO72 project"
	},
	{
		name: "description",
		message: "What is your projects' description?"
	},
	{
		name: "version",
		message: "What is your projects' version? For package.json, headers of compiled CSS/JS files.",
		default: "0.0.0",
		validate: function(input) {
			var pattern = new RegExp(/\bv?(?:0|[1-9][0-9]*)\.(?:0|[1-9][0-9]*)\.(?:0|[1-9][0-9]*)(?:-[\da-z\-]+(?:\.[\da-z\-]+)*)?(?:\+[\da-z\-]+(?:\.[\da-z\-]+)*)?\b/i);
			var result = pattern.test(input);
			if(result !== true) {
				return "Please adhere to the package.json/semver version number format: http://semver.org";
			}
			return result;
		}
	},
	{
		name: "theme_folder",
		message: "What do you want to call the theme folder? (Only valid folder names please.)",
		default: "zero72",
		validate: function(input) {
			// Check whether the name contains spaces. If so, return false. Else, return error
			if( input.indexOf(' ') >= 0 ) {
				return "No spaces please. We need a folder name.";
			}
			else {
				return true;
			}
		}
	},
	{
		name: "langcode_iso",
		message: "What is the ISO language code for your project? (To be used for the HTML lang attribute, e.g.: 'nl' or 'en'.",
		default: "en",
		validate: function(input) {
			var pattern = new RegExp(/^[A-Za-z]{2}$/);
			var result = pattern.test(input);
			if(result !== true) {
				return "Please give a two-letter code only, adhering to the ISO 639-1 standard.";
			}
			return result;
		}
	},
	{
		name: "db_hostname",
		message: "What is the hostname of the WordPress database?",
		default: "localhost",
		validate: function(input) {
			// Check whether the name contains spaces. If so, return false. Else, return error
			if( input.indexOf(' ') >= 0 ) {
				return "No spaces please.";
			}
			else {
				return true;
			}
		}
	},
	{
		name: "db_name",
		message: "What is the name of the WordPress database? (DB name, not username)",
		validate: function(input) {
			// Check whether the name contains spaces. If so, return false. Else, return error
			if( input.indexOf(' ') >= 0 ) {
				return "No spaces please.";
			}
			else {
				return true;
			}
		}
	},
	{
		name: "db_username",
		message: "What is the username of the WordPress database? (not DB name, username)",
		default: "root",
		validate: function(input) {
			// Check whether the name contains spaces. If so, return false. Else, return error
			if( input.indexOf(' ') >= 0 ) {
				return "No spaces please.";
			}
			else {
				return true;
			}
		}
	},
	{
		name: "db_password",
		message: "What is the password of the WordPress database?",
		default: "root",
		type: "password"
	},
	{
		name: "db_charset",
		message: "What is the character set used for this DB? (Usually utf8)",
		default: "utf8"
	}
];

var getPrompts = function() {
	return prompts;
};
module.exports = getPrompts;