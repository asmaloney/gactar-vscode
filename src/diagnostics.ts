import * as vscode from 'vscode'

let gactarDiagnostics: vscode.DiagnosticCollection

function init(context: vscode.ExtensionContext) {
  gactarDiagnostics = vscode.languages.createDiagnosticCollection('gactar')
  context.subscriptions.push(gactarDiagnostics)
}

function add(docURI: vscode.Uri, list: Array<vscode.Diagnostic>) {
  let newList = gactarDiagnostics.get(docURI)

  if (!newList) {
    newList = list
  } else {
    newList = newList.concat(list)
  }

  gactarDiagnostics.set(docURI, newList)
}

function clearAll(docURI: vscode.Uri) {
  gactarDiagnostics.delete(docURI)
}

function convertIssueLevelToSeverity(level: string): vscode.DiagnosticSeverity {
  if (level == 'info') {
    return vscode.DiagnosticSeverity.Information
  } else if (level == 'warning') {
    return vscode.DiagnosticSeverity.Warning
  }
  return vscode.DiagnosticSeverity.Error
}

export default { add, clearAll, convertIssueLevelToSeverity, init }
