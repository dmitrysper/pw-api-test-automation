import * as fs from 'node:fs'
import { execSync } from 'child_process'

const REQUESTS_JSON: string = './fixtures/requests.json'
const RESULT_JSON: string = './fixtures/result.json'
const CURL_STDERR_TEXT: string = './fixtures/output.txt'
const STATUS_REGEX: RegExp = /(?<=HTTP\/\d\.?\d?\s)[100-599]{3}/
const FIRST_PARAM_REGEX: RegExp = /\$1/g
const SECOND_PARAM_REGEX: RegExp = /\$2/g
const TOKEN_PARAM: string = '*'

const REQUEST_RESULT_DELAY: number = 2000

export interface RequestInfo {
  requestName: string,
  requestParam1: string,
  requestParam2: string,
  requestToken?: string
}

export class ResponseData {
  protected responseStatus: number
  protected responseHeaders: any
  protected responsePayload: string | any

  constructor(status: number, headers: any, payload: string | any) {
    this.responseStatus = status
    this.responseHeaders = headers
    this.responsePayload = payload
  }

  status(): number {
    return this.responseStatus
  }

  body(): string | any {
    let body: string | any = ''
    try {
      body = JSON.parse(this.responsePayload)
    } catch (SyntaxError) {
      body = this.responsePayload.toString()
    }
    return body
  }

  headers(): any {
    return this.responseHeaders
  }

  json(): any {
    let payload: string | any = "{}"
    try {
      payload = JSON.parse(this.responsePayload)
    } catch (SyntaxError) {
      payload = JSON.parse(payload)
    }
    return payload
  }

  text(): string {
    return this.responsePayload.toString()
  }
}

export class ApiCurlHelper {

  protected environ: string

  constructor(environment: string) {
    this.environ = environment
  }

  executeRequest(requestInfo: RequestInfo): ResponseData {
    const requestData = this.getRequestData(requestInfo)
    let command = `curl --verbose --request ${requestData["method"]!.toUpperCase()}`
    if(requestData['headers'] !== undefined) {
      command += this.getHeaders(this.updateHeaders(requestData['headers'], requestInfo))
    }
    if(requestData['payload'] !== undefined) {
      command += ` --data '${this.updatePayload(requestData['payload'], requestInfo)}'`
    }
    command += ` --url '${this.getFullURL(requestData, requestInfo)}' --output ${RESULT_JSON} 2> ${CURL_STDERR_TEXT}`
    try {
      execSync(command)  
    } catch (error: any) {
      console.log(`Error occurred while executing command - '${error.message!}', status code - '${error.status!}'`)
    }
    this.delayExecution(REQUEST_RESULT_DELAY) // sometimes execSync returns before response json is fully saved
    return this.processResponse()
  }

  private readTextFile(filePath: string): string {
    if(fs.existsSync(filePath)) {
      return fs.readFileSync(filePath,'utf-8')
    }
    return '';
  }

  private readJsonFile(jsonFilePath: string) {
    return JSON.parse(this.readTextFile(jsonFilePath))!
  }

  private readFileToArray(filePath: string): string[] {
    if(fs.existsSync(filePath)) {
      return this.readTextFile(filePath).split("\n");
    }
    return [];
  }

  private getRequestData(requestInfo: RequestInfo) {
    return this.readJsonFile(REQUESTS_JSON)[this.environ]![requestInfo.requestName]!
  }

  private updatePayload(payload: any, ri: RequestInfo): string {
    return JSON.stringify(payload)
      .replace(FIRST_PARAM_REGEX, ri.requestParam1)
      .replace(SECOND_PARAM_REGEX, ri.requestParam2)
  }

  private getFullURL(requestData: any, ri: RequestInfo): string {
    let fullURL: string = requestData['url']!
    if(requestData['endpoint'] !== undefined) {
      fullURL += `/${requestData['endpoint']}`
        .replace(FIRST_PARAM_REGEX, ri.requestParam1)
        .replace(SECOND_PARAM_REGEX, ri.requestParam2)
    }
    return fullURL
  }

  private updateHeaders(headers: any, ri: RequestInfo) {
    const token: string = ri.requestToken !== undefined ? ri.requestToken : ''
    const headerString: string = JSON.stringify(headers)
      .replace(TOKEN_PARAM, token)
    return JSON.parse(headerString)
  }

  private getHeaders(headers: any) {
    let headersString: string = "";
    Object.entries(headers).forEach(([key, value]) => {
      headersString += ` --header '${key}: ${value}'`
    })
    return headersString;
  }

  private processResponse(): ResponseData {
    const curlOutput: string = this.readTextFile(CURL_STDERR_TEXT)
    const status: string = curlOutput.match(STATUS_REGEX) ? curlOutput.match(STATUS_REGEX)![0]! : '0'
    const curlPayload: string = this.readTextFile(RESULT_JSON)
    return new ResponseData(parseInt(status), this.getResponseHeaders(), curlPayload)
  }

  private getResponseHeaders(): any {
    const outputArray: string[] = this.readFileToArray(CURL_STDERR_TEXT)
    const headersArray: string[] = outputArray
      .map((elem: string) => elem.trim())
      .filter((elem: string) => elem.includes('<') && elem.includes(':'))
      .map((elem: string) => elem.replace(/^<\s/, ''))
    let headersObj: any = {}
    headersArray.forEach((header: string) => {
      const kvPair: string[] = header.split(':')
        .map((elem: string) => elem.trim().toLowerCase())
      headersObj[kvPair[0]!] = kvPair[1]!
    })
    return headersObj
  }

  private delayExecution(delay: number): void {
    setTimeout(() => {
      execSync('curl --version')
    }, delay);
  }

}