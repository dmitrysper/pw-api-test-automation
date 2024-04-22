import { When, Then } from "@cucumber/cucumber";
import { APIResponse, expect } from "@playwright/test";
import { apiCurlHelper, apiHelper} from "./hooks";
import { RequestInfo } from "../helpers/api-helper";

const IP_ADDRESS_REGEX: RegExp = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/

When(/^user executes "([^"]*)" request$/, async function (request: string) {
    const requestInfo: RequestInfo = { requestName: request, requestParam1: '', requestParam2: '', requestToken: this.token }
    this.response = await apiHelper.executeRequest(requestInfo)
});

When(/^user executes "([^"]*)" request via (curl)$/, async function (request: string, client: string) {
        const requestInfo: RequestInfo = { requestName: request, requestParam1: '', requestParam2: '', requestToken: this.token }
        this.response = apiCurlHelper.executeRequest(requestInfo)
    });

When(/^user executes "([^"]*)" request with "([^"]*)" parameter$/, async function (request: string, requestParam: string) {
    const requestInfo: RequestInfo = { requestName: request, requestParam1: requestParam, requestParam2: '', requestToken: this.token }
    this.response = await apiHelper.executeRequest(requestInfo)
});

When(/^user executes "([^"]*)" request with "([^"]*)" and "([^"]*)" parameters$/,
  async function (request: string, requestParam1: string, requestParam2: string) {
    const requestInfo: RequestInfo = { requestName: request, requestParam1: requestParam1, requestParam2: requestParam2, requestToken: this.token }
    this.response = await apiHelper.executeRequest(requestInfo)
});

When(/^user executes "([^"]*)" request with "([^"]*)" and "([^"]*)" parameters via (curl)$/,
    async function (request: string, requestParam1: string, requestParam2: string, client: string) {
        const requestInfo: RequestInfo = { requestName: request, requestParam1: requestParam1, requestParam2: requestParam2, requestToken: this.token }
        this.response = apiCurlHelper.executeRequest(requestInfo)
});

Then(/^response code should be (\d+)$/, async function (expectedCode: number) {
      expect(this.response.status()).toBe(expectedCode);
});

Then(/^response should have "([^"]*)" header$/, async function (expectedHeader: string) {
    expect(this.response.headers()).toHaveProperty(expectedHeader);
});

Then(/^response should have "([^"]*)" header with "([^"]*)" value$/,
  async function (expectedHeader: string, expectedValue: string) {
  expect(this.response.headers()).toHaveProperty(expectedHeader, expectedValue);
});

Then(/^response payload should have "([^"]*)" property with "([^"]*)" value$/,
  async function (expectedProp: string, expectedValue: string) {
    expect(await this.response.json()).toHaveProperty(expectedProp, expectedValue);
});

Then(/^response payload should have "([^"]*)" property with (\d+) value$/,
  async function (expectedProp: string, expectedValue: number) {
    expect(await this.response.json()).toHaveProperty(expectedProp, expectedValue);
  });

Then(/^response payload should have "([^"]*)" property$/, async function (expectedProp: string) {
    expect(await this.response.json()).toHaveProperty(expectedProp);
});

Then(/^response body text should contain ip address$/, async function () {
    expect(await this.response.text()).toMatch(IP_ADDRESS_REGEX)
});
