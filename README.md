# ZERO72 project generator

This Yeoman generator for ZERO72 adds a layer of abstraction to Yeoman which makes it easier and quicker to create scaffolding.

# Installation

This entire README is one big to-do. :)

## Usage

In the `setup` folder you will find two files: `filesystem.json` and `prompts.json`.


--

You can use $`yo zero72-project --help` for more info on current arguments.

## Notes

- In filesystem.json, when using a folder with both a source and destination, a copy command will be used. This copy command *only cares about files, i.e. empty folders will not work*. If you wish to create empty folders, you can either define them with the `children` property, by writing them in a separate object in the filesystem array, or add an empty file (e.g. gitkeep) to the source directories.