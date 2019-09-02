# logerrorcode README

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
log.error({ loc: 1789, path: filePath, err: parseError} , "Error while parsing JSON file");
```

With those unique numbers, it becomes very easy to quickly find a log found in your logging system.

## Features

Describe specific features of your extension including screenshots of your extension in action. Image paths are relative to this README file.

For example if there is an image subfolder under your extension project workspace:

\!\[feature X\]\(images/feature-x.png\)

> Tip: Many popular extensions utilize animations. This is an excellent way to show off your extension!
> We recommend short, focused animations that are easy to follow.

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

Calling out known issues can help limit users opening duplicate issues against your extension.

## Release Notes

Users appreciate release notes as you update your extension.

### 1.0.0

Initial release of ...

### 1.0.1

Fixed issue #.

### 1.1.0

Added features X, Y, and Z.

-----------------------------------------------------------------------------------------------------------

## Working with Markdown

**Note:** You can author your README using Visual Studio Code.  Here are some useful editor keyboard shortcuts:

* Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux)
* Toggle preview (`Shift+CMD+V` on macOS or `Shift+Ctrl+V` on Windows and Linux)
* Press `Ctrl+Space` (Windows, Linux) or `Cmd+Space` (macOS) to see a list of Markdown snippets

### For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**
