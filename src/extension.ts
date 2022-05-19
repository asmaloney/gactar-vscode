import path = require('path')
import * as vscode from 'vscode'

var gactarTerminal: vscode.Terminal | undefined

export function activate(context: vscode.ExtensionContext) {
  vscode.window.onDidCloseTerminal((t) => {
    // If we close our terminal, reset it.
    if (t.name == 'gactar') {
      gactarTerminal = undefined
    }
  })

  let disposable = vscode.commands.registerCommand(
    'gactar.run.file',
    async () => {
      // Because of the "when" check in menus->commandPalette in package.json,
      // we know that we are running this on an amod file.

      ensureTerminalExists(context)

      const editor = vscode.window.activeTextEditor

      if (!editor || !gactarTerminal) {
        vscode.window.showErrorMessage(
          'Error showing gactar terminal. Please file an issue on the gactar-vscode GitHub page: https://github.com/asmaloney/gactar-vscode'
        )
        return
      }

      const config = vscode.workspace.getConfiguration('gactar')

      if (!(await checkGactarExists(config))) {
        vscode.window.showErrorMessage(
          'gactar is not installed properly. Please ensure you have run the gactar install script & check your gactar.installationFolder setting.'
        )
        return
      }

      // Change working directory to our gactar installation and activate our environment
      const install = config.get<string>('installationFolder')
      gactarTerminal.sendText(`cd '${install}' && source ./env/bin/activate`)

      const documentFilePath = editor.document.fileName
      const documentDir = path.dirname(editor.document.uri.path)

      if (!documentFilePath || !documentDir) {
        vscode.window.showErrorMessage(
          'Error getting document. Please file an issue on the gactar-vscode GitHub page: https://github.com/asmaloney/gactar-vscode'
        )
        return
      }

      // Set up our output folder based on config
      let outputFolder = config.get<string>('outputFolder')
      if (!outputFolder) {
        outputFolder = path.join(documentDir, 'gactar-temp')
      }

      // Which framework to run (or 'all')
      const framework = config.get<string>('framework')

      gactarTerminal.show()
      gactarTerminal.sendText(
        `./gactar -f ${framework} -o '${outputFolder}' -r '${documentFilePath}'`
      )
    }
  )

  context.subscriptions.push(disposable)
}

export function deactivate() {}

async function checkGactarExists(
  config: vscode.WorkspaceConfiguration
): Promise<boolean> {
  const installationFolder = config.get<string>('installationFolder')
  if (!installationFolder) {
    return false
  }

  const installationUI = vscode.Uri.from({
    scheme: 'file',
    path: installationFolder,
  })
  const files = await vscode.workspace.fs.readDirectory(installationUI)

  // Check for 'gactar' exe & 'env' directory
  let foundGactar = false
  let foundEnv = false
  files.forEach((file) => {
    if (file[0] == 'gactar' && file[1] == vscode.FileType.File) {
      foundGactar = true
    } else if (file[0] == 'env' && file[1] == vscode.FileType.Directory) {
      foundEnv = true
    }
  })

  return foundGactar && foundEnv
}

// ensureTerminalExists creates the gactar terminal if it doesn't exist yet.
function ensureTerminalExists(context: vscode.ExtensionContext) {
  if (!gactarTerminal || gactarTerminal.processId == undefined) {
    gactarTerminal = vscode.window.createTerminal({
      name: 'gactar',
      isTransient: true,
    })

    context.subscriptions.push(gactarTerminal)
  }
}
