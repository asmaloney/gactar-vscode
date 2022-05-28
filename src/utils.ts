import * as vscode from 'vscode'
import { Issue } from './gactar-api'

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

// issueToText takes an Issue and formats it for output.
function issueToText(issue: Issue): string {
  let text = `${issue.level}: ${issue.text}`

  if (issue.location) {
    text += `  (line ${issue.location.line}`
    if (issue.location.columnStart != 0 || issue.location.columnEnd != 0) {
      text += `, col ${issue.location.columnStart}`
      if (issue.location.columnEnd != issue.location.columnStart) {
        text += `-${issue.location.columnEnd}`
      }
    }
    text += ')'
  }

  return text
}

function showError(err: string) {
  err = `gactar: ${err}`
  console.log(err)
  void vscode.window.showErrorMessage(err)
}

export { checkGactarExists, issueToText, showError }
