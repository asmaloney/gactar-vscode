[![VS MarketPlace](https://vsmarketplacebadge.apphb.com/version/asmaloney.gactar.svg)](https://marketplace.visualstudio.com/items?itemName=asmaloney.gactar) [![GitHub](https://img.shields.io/github/license/asmaloney/gactar-vscode)](LICENSE)

# ![gactar logo](images/gactar-logo-32.png) gactar-vscode

gactar-vscode is a plugin for VS Code which implements syntax highlighting for [gactar](https://github.com/asmaloney/gactar)'s [amod format](https://github.com/asmaloney/gactar#gactar-models).

## Features

### Syntax highlighting

Provides syntax highlighting for .amod files.

![example](images/example.png)

### Snippets

Provides snippets when editing amod files:

- Typing _amod_ will show a snippet to **Insert basic amod template**. This will fill in a complete, empty amod file.
- Type _prod_ will show a snippet to **Insert amod Production**. This will add an empty production like this:

  ```
   <cursor here> {
    description: ''

    match {
        goal []
    }
    do {
    }
  }
  ```

## Reference

I wrote up a technical note about [gactar](https://github.com/asmaloney/gactar) which includes more information about the amod format. It may be found on [ResearchGate](https://www.researchgate.net/).

**Title:** gactar: A Tool For Exploring ACT-R Modelling

**DOI:** [10.13140/RG.2.2.25387.36642](https://dx.doi.org/10.13140/RG.2.2.25387.36642)
