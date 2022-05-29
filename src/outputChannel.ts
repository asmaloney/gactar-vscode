import * as vscode from 'vscode'

export let gactarOutputChannel: vscode.OutputChannel

function init(context: vscode.ExtensionContext) {
  gactarOutputChannel = vscode.window.createOutputChannel(
    'gactar',
    'gactar-output'
  )
  context.subscriptions.push(gactarOutputChannel)
}

export default { init }
