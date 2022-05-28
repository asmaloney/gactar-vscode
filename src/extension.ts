import * as path from 'path'
import * as vscode from 'vscode'

import diagnostics from './diagnostics'
import api, {
  Issue,
  IssueList,
  ResultMap,
  RunParams,
  RunResult,
} from './gactar-api'
import { gactarOutputChannel, initChannel } from './outputChannel'
import {
  restartGactarServer,
  runGactarServer,
  serverRunning,
  shutdownGactarServer,
} from './server'
import { checkGactarExists, issueToText, showError } from './utils'

let gactarRestartBeforeRun = false // set this to restart the server before we try to run

export function activate(context: vscode.ExtensionContext) {
  diagnostics.init(context)
  initChannel(context)

  vscode.workspace.onDidChangeConfiguration(
    (event: vscode.ConfigurationChangeEvent) => {
      const affected = event.affectsConfiguration('gactar.intermediateFolder')
      if (affected) {
        gactarRestartBeforeRun = true
      }
    }
  )

  // gactar.run.file
  let disposable = vscode.commands.registerCommand(
    'gactar.run.file',
    async () => {
      const editor = vscode.window.activeTextEditor

      if (!editor) {
        void vscode.window.showErrorMessage(
          'Error getting active editor. Please file an issue on the gactar-vscode GitHub page: https://github.com/asmaloney/gactar-vscode'
        )
        return
      }

      // Ensure we are on an open amod file.
      if (!editor.document || editor.document.languageId != 'amod') {
        return
      }

      const config = vscode.workspace.getConfiguration('gactar')

      if (!(await checkGactarExists(config))) {
        showError(
          'gactar is not installed properly. Please ensure you have run the gactar install script & check your gactar.installationFolder setting.'
        )
        return
      }

      const documentDir = path.dirname(editor.document.uri.path)
      if (!documentDir) {
        showError(
          'Error getting document. Please file an issue on the gactar-vscode GitHub page: https://github.com/asmaloney/gactar-vscode'
        )
        return
      }

      // If we've changed a config which requires a server restart, then do that.
      if (serverRunning() && gactarRestartBeforeRun) {
        gactarRestartBeforeRun = false
        await restartGactarServer()
      } else {
        await runGactarServer()
      }

      gactarOutputChannel.show()

      // Which framework to run (or 'all')
      let framework = config.get<string>('framework')
      if (!framework) {
        framework = 'all'
      }

      runAMOD(editor.document, framework)
    }
  )
  context.subscriptions.push(disposable)

  // gactar.server.restart
  disposable = vscode.commands.registerCommand('gactar.server.restart', () => {
    void restartGactarServer()
  })
  context.subscriptions.push(disposable)
}

export function deactivate() {
  shutdownGactarServer()
}

function runAMOD(doc: vscode.TextDocument, framework: string) {
  gactarOutputChannel.appendLine(`Running gactar on ${framework}...`)

  diagnostics.clearAll(doc.uri)

  const params: RunParams = {
    amod: doc.getText(),
    goal: '',
    frameworks: [framework],
  }

  api
    .run(params)
    .then((results: RunResult) => {
      if ('results' in results) {
        processResults(results.results)
      } else {
        processIssues(results.issues, doc)
      }
    })
    .catch((err: Error) => {
      showError(err.message)
    })
}

// processResults will output our results to the output channel.
function processResults(results: ResultMap) {
  for (const [frameworkName, result] of Object.entries(results)) {
    let text = frameworkName + '\n' + '---\n'

    if (result.filePath) {
      const uri = vscode.Uri.file(result.filePath)
      text += `Intermediate file: ${uri.toString()}\n\n`
    }

    if (result.output.length == 0) {
      text += '(No output)'
    } else {
      text += result.output
    }

    text += '\n\n'

    gactarOutputChannel.append(text)
  }
}

function processIssues(issues: IssueList, doc: vscode.TextDocument) {
  const diagnosticList = new Array<vscode.Diagnostic>()

  issues.forEach((issue: Issue) => {
    const text = issueToText(issue) + '\n'
    gactarOutputChannel.append(text)

    let line = issue.line
    if (line) {
      line = line - 1 // lines are 0-based in vscode
    }

    const diag = new vscode.Diagnostic(
      new vscode.Range(line, issue.columnStart, line, issue.columnEnd),
      issue.text,
      diagnostics.convertIssueLevelToSeverity(issue.level)
    )

    diag.source = 'gactar'

    diagnosticList.push(diag)
  })

  if (doc) {
    diagnostics.add(doc.uri, diagnosticList)
  }
}
