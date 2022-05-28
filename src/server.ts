import * as child_process from 'child_process'
import * as net from 'net'

import * as vscode from 'vscode'

import treeKill = require('tree-kill')

import api from './gactar-api'
import { gactarOutputChannel } from './outputChannel'
import { showError } from './utils'

let gactarWebServer: child_process.ChildProcess | null
let gactarWebServerInitialized = false // true when the server is running and ready for requests

async function getFreePort() {
  return new Promise<number>((res) => {
    const srv = net.createServer()
    if (!srv) {
      throw 'cannot create a server'
    }

    srv.listen(0, () => {
      const addr = srv.address() as net.AddressInfo
      if (!addr) {
        throw 'cannot get address'
      }
      const port = addr.port
      srv.close(() => res(port))
    })
  })
}

function isRunning(): boolean {
  return gactarWebServer != null
}

async function run(): Promise<void> {
  // If it's already running, return
  if (gactarWebServer) {
    return
  }

  const config = vscode.workspace.getConfiguration('gactar')

  const installationPath = config.get<string>('installationFolder')
  if (!installationPath) {
    showError(
      'Error getting install path. Please check gactar.installationFolder setting.'
    )
    return
  }

  gactarOutputChannel.show()
  gactarOutputChannel.appendLine('Starting gactar web server...')

  // Find a free port to use
  const port = await getFreePort()
  api.init(port)

  const intermediateFolder = config.get<string>('intermediateFolder')
  let tempSwitch = ''
  if (intermediateFolder && intermediateFolder != '') {
    tempSwitch = `-temp '${intermediateFolder}'`
  }

  return new Promise<void>((resolve, reject) => {
    const serverDefaults: child_process.SpawnOptions = {
      cwd: installationPath,
      shell: true,
      stdio: ['ignore', 'pipe', 'pipe'],
    }

    gactarWebServer = child_process.spawn(
      `source ./env/bin/activate && ./gactar -w -p ${port} ${tempSwitch}`,
      serverDefaults
    )

    if (
      !gactarWebServer ||
      !gactarWebServer.stdout ||
      !gactarWebServer.stderr
    ) {
      void vscode.window.showErrorMessage('Error starting gactar server')
      reject()
      return
    }

    gactarWebServer.on('error', (err: Error) => {
      gactarOutputChannel.appendLine(
        `Error running gactar web server: ${err.message}`
      )
    })

    gactarWebServer.on('exit', () => {
      gactarOutputChannel.appendLine('Shutting down gactar web server...')
    })

    let initialOutput = '' // used to keep all the initial text in case it is broken up

    gactarWebServer.stdout.on('data', (data: Buffer) => {
      const dataStr = data.toString()

      gactarOutputChannel.append(dataStr)

      if (!gactarWebServerInitialized) {
        initialOutput += dataStr

        // Wait until we are ready to serve
        if (initialOutput.includes('Serving gactar on')) {
          gactarOutputChannel.appendLine('...ready to serve')
          gactarWebServerInitialized = true
          resolve()
        }
      }
    })

    gactarWebServer.stderr.on('data', (data: Buffer) => {
      gactarOutputChannel.append(data.toString())
      resolve()
    })
  })
}

function shutdown() {
  if (!gactarWebServer) {
    return
  }

  const pid = gactarWebServer.pid
  gactarWebServerInitialized = false
  gactarWebServer = null

  if (pid) {
    treeKill(pid)
  }
}

async function restart() {
  shutdown()
  await run()
}

export default {
  restart,
  run,
  isRunning,
  shutdown,
}
