# logerrorcode vscode extension

This extension for Visual Studio Code allows you to easily insert into your code a log error statement with a unique number,
making it easy to find the location of an error in production.

Why?

Each time you write a line of code which could potentially fail or throw an exception, you need some kind of logging mechanism
to record that situation. Usually, this is a log statement like:
```
log.error(`Error while parsing JSON file:${filePath}`);
```

The problem is that, when those errors happen in production, it can be tricky to quickly find where those log messages originate from.

The goal of this extension is to easily generate a unique number along with your message such as:

```
log.error(`[1789]: Error while parsing JSON file:${filePath}`);
```
or, if you have a more sophisticated logging library:
```
log.error({ loc: 1789, path: filePath, err: parseError} , "Error while parsing JSON file");
```

With those unique numbers, it becomes very easy to quickly find a log found in your logging system.

## Features

- multiple projects support: you can have a counter per project,
- customizable log statements: you use the `%%COUNTER%%` placeholder to hold the value of the counter
- team support: you can easily setup a function on Azure to hold those counter for you. You can query for a block of values to avoid calling the function too frequently

## Requirements

If you have any requirements or dependencies, add a section describing those and how to install and configure them.

## Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

* `myExtension.enable`: enable/disable this extension
* `myExtension.thing`: set to `blah` to do something

## Known Issues

No known issues for know.

Feel free to post any issue [here](https://github.com/pcarion/vscode-logerrorcode/issues).

## Release Notes

### 0.0.2

* read the configuration at each invokation to allow changes in settings
* update README
* fix git URL


### 0.0.1

Initial release of the extension

