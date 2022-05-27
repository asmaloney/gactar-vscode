import axios, { AxiosInstance } from 'axios'

let gactarHTTP: AxiosInstance

function init(port: number) {
  const url = `http://localhost:${port}`

  gactarHTTP = axios.create({
    headers: { 'Content-Type': 'application/json' },
    baseURL: url,
  })
}

// version
export interface Version {
  version: string
}

async function getVersion(): Promise<Version> {
  const response = await gactarHTTP.get<Version>('/api/version')
  return response.data
}

// run
export interface RunParams {
  // The text of the amod to run.
  amod: string

  // The starting goal.
  goal: string

  // An optional list of frameworks ("all" if not set).
  frameworks?: string[]
}

export interface Result {
  // Result maps from runResult struct in gactar's web/web.go.

  // Name of the model (from the amod text).
  modelName: string

  // Intermediate code file (full path).
  filePath: string

  // Code which was run.
  code?: string

  // Output of run (stdout + stderr).
  output: string
}

export type ResultMap = { [key: string]: Result }

export interface Results {
  results: ResultMap
}

export interface Issue {
  level: string
  text: string
  line: number
  columnStart: number
  columnEnd: number
}

export type IssueList = Issue[]

export interface RunIssues {
  issues: IssueList
}

export type RunResult = Results | RunIssues

async function run(params: RunParams): Promise<RunResult> {
  const response = await gactarHTTP.post<RunResult>('/api/run', params)
  return response.data
}

// examples
export interface ExampleList {
  example_list: string[]
}

async function getExampleList(): Promise<ExampleList> {
  const response = await gactarHTTP.get<ExampleList>('/api/examples/list')
  return response.data
}

async function getExample(name: string): Promise<string> {
  const response = await gactarHTTP.get<string>('/api/examples/' + name)
  return response.data
}

export default {
  getExample,
  getExampleList,
  getVersion,
  init,
  run,
}
