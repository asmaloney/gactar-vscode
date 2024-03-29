import axios, { AxiosInstance } from 'axios'

let gactarHTTP: AxiosInstance

function init(port: number) {
  gactarHTTP = axios.create({
    headers: { 'Content-Type': 'application/json' },
    baseURL: `http://localhost:${port}`,
  })
}

// This is copied from gactar 0.6.0's api.ts file.

// version
export type Version = string

export interface VersionResponse {
  // The current version tag when gactar was built.
  version: Version
}

async function getVersion(): Promise<Version> {
  const response = await gactarHTTP.get<VersionResponse>('/api/version')
  return response.data.version
}

// run
export interface RunOptions {
  // An optional list of frameworks (default: "all").
  frameworks?: string[]

  // "min", "info", "detail" (default: "info")
  logLevel?: string

  // Show trace activations (default: off)
  traceActivations?: boolean

  // Set a specific random seed (default: nil)
  randomSeed?: number
}

export interface RunParams {
  // The text of the amod to run.
  amod: string

  // The starting goal.
  goal: string

  // Run options.
  options?: RunOptions
}

// Location of an issue in the source code.
export interface Location {
  line: number
  columnStart: number
  columnEnd: number
}

export interface Issue {
  // Severity of the issue.
  level: string

  // Text of the issue.
  text: string

  // Location in the code (optional)
  location?: Location
}

export type IssueList = Issue[]

export interface FrameworkResult {
  // Name of the model (from the amod text).
  modelName: string

  // Any issues specific to a framework.
  issues?: IssueList

  // Intermediate code file (full path).
  filePath?: string

  // Code which was run.
  code?: string

  // Output of run (stdout + stderr).
  output?: string
}

export type FrameworkResultMap = { [key: string]: FrameworkResult }

export interface RunResult {
  issues?: IssueList
  results?: FrameworkResultMap
}

async function run(params: RunParams): Promise<RunResult> {
  const response = await gactarHTTP.post<RunResult>('/api/run', params)
  return response.data
}

export default {
  getVersion,
  init,
  run,
}
