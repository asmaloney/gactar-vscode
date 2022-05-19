# Change Log

All notable changes to the gactar VS Code extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## 0.1.0 - 2022-05-19

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
