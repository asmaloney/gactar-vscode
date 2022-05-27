import * as vscode from 'vscode'

let gactarOutputChannel: vscode.OutputChannel

function initChannel(context: vscode.ExtensionContext) {
  gactarOutputChannel = vscode.window.createOutputChannel('gactar')
  context.subscriptions.push(gactarOutputChannel)
}

export { gactarOutputChannel, initChannel }
