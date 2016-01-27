# ZERO72 project generator

A custom-built Yeoman generator for ZERO72 which allows for the quick creation of templates, which in turn allow for jiffy front-end scaffolding.

![ZERO72 logo]
(https://raw.githubusercontent.com/ZERO72/generator-zero72-project/master/ZERO72-logo.png)

The ZERO72 project generator adds some extra functionality on top of Yeoman. The primary aim of this is to make it even faster to scaffold front-end projects. Currently, the tool comes packed with three (template) generators: Angular, WordPress, and plain. You can easily edit a few Javascript/JSON files and a few templates to scaffold a complete front-end project.

We figured that the setup of projects was taking us quite some time, while in effect, many of the projects based around a technique (WordPress, Angular...) are quite similar in folder structure setup. Also, we wanted to be able to standardize our folder structure archetypes, while still allowing them to evolve over time. We think Yeoman is great, but creating a generator from scratch is still quite the chore. Thus, we decided to take it one step further and make a simple interface to Yeoman's functionality. With a little flavor added on top.

# Table of Contents

# Installation

In order to work with the ZERO72 project generator, you will need a few things:

- A proper command line tool. On Mac and Linux, these are shipped with the OS. On Windows however, you will probably want to use a better command line tool, such as [`cmder`](http://cmder.net) or `PowerShell`.
- [`Node.js`](http://nodejs.org) and [`npm`](https://www.npmjs.com) installed on your computer.
- A globally installed version of [`Yeoman`](http://yeoman.io). (Run `npm install -g yo`)

When you have all this, run the following command:

```
npm install -g generator-zero72-project
```

# Usage

First, go to the directory where you want to scaffold your project in your command line tool of choice. To run the generator, enter the following command: 

```
yo zero72-project [project-type]
```

One example of this would be: `yo zero72-project angular`. The project types are defined in `./generators/project-types.json`. These definitions need to correspond with the folder names inside `./generators/templates`. If you forget the project type parameter, or use `yo zero72-project --help`, you can view a listing of all the active types.

After you've booted up the generator, simply answer all of the questions. Then wait for a bit. Your project folder will be set up, and some plug-ins (node_modules) will be installed. Also, a lot of debug info is printed in case something goes wrong. After a while, the tool will tell you everything seems to have gone ok.



# Editing templates

In the `setup` folder you will find two files: `filesystem.json` and `prompts.json`.

# Burning questions

### How do I use the checkbox prompt, for example when choosing Node modules?
Use space to toggle options on or off, arrows up and down for navigating, enter/return to confirm.



# Notes

- In filesystem.json, when using a folder with both a source and destination, a copy command will be used. This copy command *only cares about files, i.e. empty folders will not work*. If you wish to create empty folders, you can either define them with the `children` property, by writing them in a separate object in the filesystem array, or add an empty file (e.g. gitkeep) to the source directories.
- When running the generator, it will first check whether your target directory is empty. If not, you will be asked if you want to delete the contents of the folder. The deletion process will only begin after answering the last question, before creating new files. All files are checked for and deleted, except for `.DS_Store` (Mac) and `Thumbs.db` (Windows).