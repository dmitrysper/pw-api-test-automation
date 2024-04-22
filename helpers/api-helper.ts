import { request, APIRequestContext } from "@playwright/test";
import * as fs from 'node:fs'

const REQUESTS_JSON: string = './fixtures/requests.json'
const DEFAULT_METHOD: string = 'get'
const FIRST_PARAM_REGEX: RegExp = /\$1/g
const SECOND_PARAM_REGEX: RegExp = /\$2/g
const TOKEN_PARAM: string = '*'

export interface RequestInfo {
  requestName: string,
  requestParam1: string,
  requestParam2: string,
  requestToken?: string
}

export class ApiHelper {

  protected rc: APIRequestContext
  protected environ: string

  constructor(requestContext: APIRequestContext, environment: string) {
    this.rc = requestContext
    this.environ = environment
  }

  async executeRequest(requestInfo: RequestInfo) {
    const requestData = this.getRequestData(requestInfo)
    let options: any = {
      method: requestData['method'] ? requestData['method'] : DEFAULT_METHOD
    }
    if(requestData['payload'] !== undefined) {
      options['data'] = this.updatePayload(requestData['payload'], requestInfo)
    }
    if(requestData['headers'] !== undefined) {
      options['headers'] = this.updateHeaders(requestData['headers'], requestInfo)
    }
    return await this.rc
        .fetch(this.getFullURL(requestData, requestInfo), options);
  }

  private readJsonFile(jsonFilePath: string) {
    return JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'))!
  }

  private getRequestData(requestInfo: RequestInfo) {
    return this.readJsonFile(REQUESTS_JSON)[this.environ]![requestInfo.requestName]!
  }

  private updatePayload(payload: any, ri: RequestInfo) {
    const payloadString: string = JSON.stringify(payload)
      .replace(FIRST_PARAM_REGEX, ri.requestParam1)
      .replace(SECOND_PARAM_REGEX, ri.requestParam2)
    return JSON.parse(payloadString)
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
    const token = ri.requestToken !== undefined ? ri.requestToken : ''
    const headerString: string = JSON.stringify(headers)
      .replace(TOKEN_PARAM, token)
    return JSON.parse(headerString)
  }

}