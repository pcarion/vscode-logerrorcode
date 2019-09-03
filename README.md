# Functionality

This extension for [Visual Studio Code]((https://github.com/Microsoft/vscode)) allows you to easily insert into your code a log error statement with a unique number,
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

This extension works better with the associated Azure function which delivers counter blocks for each configured project.

The code of this azure function ias available here: https://github.com/pcarion/vscode-logerrorcode-function

## Extension Settings

This extension contributes the following settings:

* `insertlogerrorcode.serviceURL`: URL of the service used to return error codes (null if no external service used)
* `insertlogerrorcode.serviceFunctionKey`: the function key to use to access the service function (null if no external service used)
* `insertlogerrorcode.projectName`: name of the project to retrieve counters for
* `insertlogerrorcode.counterIncrementValue`: increment to use when requesting error code to the remote service
* `insertlogerrorcode.logStatementToInsert`: statement to insert on invokation. %%counter%% is replaced with the value of the counter
* `insertlogerrorcode.showDebugInformation`: set to true to have extension debug information in the output channel

## Known Issues

* The system don't behave as expected when you switch between projects ([issue-1](https://github.com/pcarion/vscode-logerrorcode/issues/1))

Feel free to post any issue [here](https://github.com/pcarion/vscode-logerrorcode/issues).


