import * as vscode from 'vscode'

export let gactarOutputChannel: vscode.OutputChannel

function init(context: vscode.ExtensionContext) {
  gactarOutputChannel = vscode.window.createOutputChannel('gactar')
  context.subscriptions.push(gactarOutputChannel)
}

export default { init }
