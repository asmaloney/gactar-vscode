# Change Log

All notable changes to the gactar VS Code extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [0.4.0](https://github.com/asmaloney/gactar-vscode/releases/tag/v0.4.0) - 2024-01-23

### Changed

- Changed method of running server to work with gactar 0.13.0.
- Sync amod syntax with gactar 0.13.0.
- Updated all dependencies.

## [0.3.3](https://github.com/asmaloney/gactar-vscode/releases/tag/v0.3.3) - 2022-07-07

### Changed

- Sync amod syntax with gactar 0.10.0.

## [0.3.2](https://github.com/asmaloney/gactar-vscode/releases/tag/v0.3.2) - 2022-06-21

### Added

- Added some snippets for creating sections:

  | Prefix | Name                            |
  | ------ | ------------------------------- |
  | ~~m    | Insert amod model section       |
  | ~~c    | Insert amod config section      |
  | ~~i    | Insert amod init section        |
  | ~~p    | Insert amod productions section |

### Changed

- Sync amod syntax with gactar 0.9.0.

### Fixed

- Fixed "amod" snippet to use proper section delimiters.

## [0.3.1](https://github.com/asmaloney/gactar-vscode/releases/tag/v0.3.1) - 2022-06-13

### Added

- Output gactar version when starting server.

### Changed

- Sync amod syntax with gactar 0.8.0.

## [0.3.0](https://github.com/asmaloney/gactar-vscode/releases/tag/v0.3.0) - 2022-05-31

### Added

- Added per-framework issues to report framework-specific issues with an amod file.
- Added syntax colouring to the Output Panel.
- Use selected text in the editor as the initial goal when running if it looks like a chunk. This way you can select one of the examples in the amod file and run it easily.

### Changed

- Sync API with gactar 0.6.0.
- Sync syntax with gactar 0.6.0.

## [0.2.1](https://github.com/asmaloney/gactar-vscode/releases/tag/v0.2.1) - 2022-05-27

### Fixed

- Fixed node packaging issue.

## [0.2.0](https://github.com/asmaloney/gactar-vscode/releases/tag/v0.2.0) - 2022-05-26

### Added

- Use the web server and Output Panel instead of the command line with the Terminal. ([#1](https://github.com/asmaloney/gactar-vscode/pull/1))
- Now highlights errors in amod files and adds them to the Problems Panel.
- Command: `gactar: Restart Server` will restart the gactar web server.

### Changed

- Config: `gactar.outputFolder` was renamed to `gactar.intermediateFolder`.
- Configured eslint to run on the code.

## [0.1.0](https://github.com/asmaloney/gactar-vscode/releases/tag/v0.1.0) - 2022-05-19

### Added

- Snippet: when the user types "amod" in an amod file, offer to fill in a basic amod file.
- Snippet: when the user types "prod" in an amod file, offer to add a production.
- Config: `gactar.installationFolder` - path to your gactar installation.
- Config: `gactar.framework` - choose which framework to run (or "all" for all available).
- Config: `gactar.outputFolder` - where to put the intermediate files (defaults to a new directory next to the amod file called `gactar-temp` if not set).
- Command: `gactar: Run Current File` runs the current file through gactar and outputs results in the terminal.

## 0.0.2 - 2022-05-18

### Added

- Include badges at top of README.

### Changed

- Fix icon sizes so they work better in the README and in the Visual Studio Marketplace.

## 0.0.1 - 2022-05-17

- Initial release.
