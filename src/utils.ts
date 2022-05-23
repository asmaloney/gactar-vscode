import * as vscode from 'vscode'

// checkGactarExists looks for the executable & the 'env' directory in the specified
// gactar.installationFolder.
async function checkGactarExists(
  config: vscode.WorkspaceConfiguration
): Promise<boolean> {
  const installationFolder = config.get<string>('installationFolder')
  if (!installationFolder) {
    return false
  }

  const installationUI = vscode.Uri.file(installationFolder)
  const files = await vscode.workspace.fs.readDirectory(installationUI)

  // Check for 'gactar' exe & 'env' directory
  let foundGactar = false
  let foundEnv = false

  files.forEach((file: [name: string, type: vscode.FileType]) => {
    if (file[0] == 'gactar' && file[1] == vscode.FileType.File) {
      foundGactar = true
    } else if (file[0] == 'env' && file[1] == vscode.FileType.Directory) {
      foundEnv = true
    }
  })

  return foundGactar && foundEnv
}

function showError(err: string) {
  err = `gactar: ${err}`
  console.log(err)
  void vscode.window.showErrorMessage(err)
}

export { checkGactarExists, showError }
