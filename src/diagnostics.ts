import * as vscode from 'vscode'

let gactarDiagnostics: vscode.DiagnosticCollection

function initDiagnostics(context: vscode.ExtensionContext) {
  gactarDiagnostics = vscode.languages.createDiagnosticCollection('gactar')
  context.subscriptions.push(gactarDiagnostics)
}

function clearAllDiagnostics(doc: vscode.TextDocument) {
  gactarDiagnostics.delete(doc.uri)
}

export { clearAllDiagnostics, gactarDiagnostics, initDiagnostics }
