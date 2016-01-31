# ZERO72 project generator

A custom-built Yeoman generator for ZERO72 which allows for the quick creation of templates, which in turn allow for jiffy front-end scaffolding.

![ZERO72 logo]
(https://raw.githubusercontent.com/ZERO72/generator-zero72-project/master/ZERO72-logo.png)

The ZERO72 project generator adds some extra functionality on top of Yeoman. The primary aim of this is to make it even faster to scaffold front-end projects. Currently, the tool comes packed with three (template) generators: Angular, WordPress, and plain. You can easily edit a few Javascript/JSON files and a few templates to scaffold a complete front-end project.

We figured that the setup of projects was taking us quite some time, while in effect, many of the projects based around a technique (WordPress, Angular...) are quite similar in folder structure setup. Also, we wanted to be able to standardize our folder structure archetypes, while still allowing them to evolve over time. We think Yeoman is great, but creating a generator from scratch is still quite the chore. Thus, we decided to take it one step further and make a simple interface to Yeoman's functionality. With a little flavor added on top.

# Table Of Contents
- [Installation](#Installation)
- [Usage](#Usage)
- [Working With Templates](#Templates)
- [Burning Questions](#Questions)
- [Notes](#Notes)

# <a name="Installation"></a>Installation

In order to work with the ZERO72 project generator, you will need a few things:

- A proper command line tool. On Mac and Linux, these are shipped with the OS. On Windows however, you will probably want to use a better command line tool, such as [`cmder`](http://cmder.net) or `PowerShell`.
- [`Node.js`](http://nodejs.org) and [`npm`](https://www.npmjs.com) installed on your computer.
- A globally installed version of [`Yeoman`](http://yeoman.io). (Run `npm install -g yo`)

When you have all this, run the following command:

```
npm install -g generator-zero72-project
```

# <a name="Usage"></a>Usage

First, go to the directory where you want to scaffold your project in your command line tool of choice. To run the generator, enter the following command: 

```
yo zero72-project [project-type]
```

One example of this would be: `yo zero72-project angular`. The project types are defined in `./generators/project-types.json`. These definitions need to correspond with the folder names inside `./generators/templates`. If you forget the project type parameter, or use `yo zero72-project --help`, you can view a listing of all the active types.

After you've booted up the generator, simply answer all of the questions. Then wait for a bit. Your project folder will be set up, and some plug-ins (node_modules) will be installed. Also, a lot of debug info is printed in case something goes wrong. After a while, the tool will tell you everything seems to have gone ok.



# <a name="Templates"></a>Working With Templates

This is where things get a little more complex, and a lot more powerful.

Each template requires a number of components:

- An entry under `types` in `./generators/project-types.json`.
- A folder with exactly the same name as the defined type above inside of `./generators/templates/`.
- Inside this folder, there needs to be another folder called `_setup`. E.g.: `./generators/templates/my-project-type/_setup`.
- Inside of this setup folder, three files are required:
	- `prompts.js`
	- `filesystem.json`
	- `npm.json`
- Lastly, you will probably need some files and folders to copy over to your target directory. :) NOTE: The folder structure inside your template folder does not need to be identical to the desired result. You can build it in that way, but it is not required.

## project-types.json

Project types (the different types of templates) are defined in `./generators/project-types.json`. These definitions need to correspond with the folder names inside `./generators/templates/`. Please use valid folder names only. Standard JSON array syntax is required:

```javascript
[
	"type-a",
	"type-b",
	"type-c"
]
```

## prompts.js
This file should operate as an NPM Module. It is imperative that it will return an array of objects suited for insertion into [`Inquirer.js`](https://github.com/SBoudrias/Inquirer.js/), which is used by Yeoman. See the documentation pages for [`Inquirer.js`](https://github.com/SBoudrias/Inquirer.js/) for more info on how to define the prompts.

To make sure it will work properly as an Node module, make sure the following (or similar to the same effect) is included:

```javascript
var getPrompts = function() {
	return prompts;
};
module.exports = getPrompts;
```

Then, simply define these prompts like this:

```javascript
var prompts = [
	{
		name: "myPrompt",
		message: "What kind of question would you like to ask?",
		default: "default-answer",
		validate: function(input) {
			// Returning true will accept the answer; returning false, or a string, will reject the input.
			// When returning a string, it will be displayed as feedback to the user.
			if( input.indexOf(' ') >= 0 ) {
				return "No spaces please.";
			}
			else {
				return true;
			}
		}
	},
	{
		name: "someQuestion",
		message: "Another question?",
		type: "confirm"
	}
];
```

After the prompting phase, you will be able to use template tags in all the files outside of the `_setup` folder (but within your template), as well as in filesystem.json. The `name` property of a prompt object will be used to get the answer.

## filesystem.json

Here, you can define which files and folders will be copied into the output directory, and how they will be processed. The file should contain an array of objects with specific properties. The most important one is `type`: use `"file"` for files and `"folder"` for folders.

Please note that template tags can be used inside of `filesystem.json` (in `name` properties) to allow for dynamic file and/or folder names.

### Files

Files can only be copied from their respective template directory and must have three properties: `type`, `name`, and `source`. Optionally, you can use the `template` property (and set it to false) to make sure template tags will not get processed. (By default, they are.)

The `source` property defines where to find the file, relative to the root of the template folder in question. E.g., when giving `app/index.html` as a `source`, it will be sought for in: `./generators/templates/my-project-type/app/index.html`.

The `name` property is pretty much the same as `source`, except that it refers to the target directory. (Where the user is setting up their project.) In this way, your source folder structure may look different than the desired result will, allowing for greater flexibility.

The `template` property is not required; `template` will be assumed to be true by default. Please note that passing a string "false" will not work, it needs to be the boolean value _false_. When the property is true, the file will be checked for template tags, and if they are found, they will be processed.

```javascript
{
	"type": "file",
	"name": "app/views/index.html",
	"source": "index.html",
	"template": false
}
```

### Folders

Folders work in mostly the same way as files do, except for a few key differences:

- Folders can be created as empty by omitting the `source` property.
- Folders can have the `children` property, containing an array of objects (more files and/or folders).
- Folders are defined as having a `type` of `"folder"`.
- Folders will be copied _recursively_, so you don't have to make the `filesystem.json` file exceedingly long/expansive.

Example:

```javascript
{
	"type": "folder",
	"name": "test",
	"children": [
		{
			"type": "folder",
			"name": "test2"
		}
	]
}
```

**Tip**: _give an empty string for the `name` property of a folder to copy its contents into the root of the users' target directory. In this way, you might do something like this:_

```javascript
{
	"type": "folder",
	"name": "",
	"source": "wordpress_core",
	"template": false
}
```

## npm.json

This file will let you define if and how npm will be used. It consists of an object with two properties: `mandatory` and `optional`.

The `mandatory` property is an array of npm package names. E.g.: 'angular', 'grunt'. These will be installed at the end of the scaffolding process automatically.

The `optional` property allows the user to choose optional packages, via a prompt. It is an array of objects with two properties each: `name` and `checked`. The name value works in the same way as for the `mandatory` property, `checked` needs to be either _true_ or _false_ (as a boolean, not as a string.) The reason for this is that the optional packages will be added as the last prompt automatically. (Only if given, of course.)

Example:
```javascript
{
	"mandatory": [
		"angular",
		"angular-animate",
		"angular-route",
		"grunt",
		"grunt-contrib-concat",
		"grunt-contrib-copy",
		"grunt-contrib-jshint",
		"grunt-contrib-uglify",
		"grunt-contrib-watch",
		"grunt-ng-annotate",
		"grunt-processhtml",
		"grunt-sass"
	],
	"optional": [
		{
			"name": "jquery",
			"checked": true
		},
		{
			"name": "bootstrap-sass"
		}
	]
}
```

## Template tags

The templating system used here is provided by [`EJS`](http://ejs.co), as with all Yeoman generators. These are very easy to use. [`Check out their site`](http://ejs.co) for full documentation of its abilities.

Essentially, everything works with tags, which look like this:

- `<% some_var %>` (evaluate a statement)
- `<%= some_var %>` (echo a var)

These `some_var` values are retrieved from `prompts.js`. (Stored as the `name` property of each prompt object.) The tags can be used in different places across the application:

- filesystem.json (for dynamic file/folder names)
- Template files (everything in your template folder, save for `_setup`)

By evaluating statements in EJS, you can do some powerful things:

```html
<ul>
<% for(var i=0; i<cars.length; i++) {%>
   <li><%= cars[i] %></li>
<% } %>
</ul>
```

* * * *

# <a name="Questions"></a>Burning Questions

### How do I use the checkbox prompt, for example when choosing Node modules?
Use space to toggle options on or off, arrows up and down for navigating, enter/return to confirm.

### Why is `prompts.js` a Javascript file while all the other setup files are in JSON format?
We prefer JSON to store data, as we find it to be more semantic. However, JSON does not such things as functions or comments. Because Yeoman feeds these prompts into [`Inquirer.js`](https://github.com/SBoudrias/Inquirer.js/), where callbacks are required for dynamic functionality such as validation, we opted to change this one file to Javascript.

* * * *

# <a name="Notes"></a>Notes

- In filesystem.json, when using a folder with both a source and destination, a copy command will be used. This copy command *only cares about files, i.e. empty folders will not work*. If you wish to create empty folders, you can either define them with the `children` property, by writing them in a separate object in the filesystem array, or add an empty file (e.g. gitkeep) to the source directories.
- When running the generator, it will first check whether your target directory is empty. If not, you will be asked if you want to delete the contents of the folder. The deletion process will only begin after answering the last question, before creating new files. All files are checked for and deleted, except for `.DS_Store` (Mac) and `Thumbs.db` (Windows).
- Optional packages, (in `npm.json`) if given, will be added to the end of the prompts array automatically.