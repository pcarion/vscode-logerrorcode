# Change Log

All notable changes to the "logerrorcode" extension will be documented in this file.

## 0.0.4

### Added

* pass the value of the max local counter to the service so that the service can (re)sync its counter

### Changed

* change default substitution string to be more language agnostic: `/* ERR:%%counter%% */`

### Fixed

* use the name of the project as the storage name for the local counters. This allows the support of multiple counters

## 0.0.3

### Added

* added a CHANGELOG.md file

### Changed

* improve site documentation by updating README.md file
* followed guidelines from [this document](https://code.visualstudio.com/api/working-with-extensions/publishing-extension) and [this one](https://code.visualstudio.com/api/references/extension-manifest#marketplace-presentation-tips)
* added icon image

## 0.0.2

### Added
* read the configuration at each invocation to allow changes in settings

### Changed
* update README
* fix git URL


## 0.0.1

Initial release of the extension
