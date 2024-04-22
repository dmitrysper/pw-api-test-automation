import { Before, setDefaultTimeout } from "@cucumber/cucumber";
import { request } from "@playwright/test";
import { ApiHelper } from "../helpers/api-helper";
import { ApiCurlHelper } from "../helpers/api-curl-helper";

const DEFAULT_TIMEOUT_MS: number = 1500 * 1000;

setDefaultTimeout(DEFAULT_TIMEOUT_MS);

export let apiHelper: ApiHelper
export let apiCurlHelper: ApiCurlHelper

Before( { tags: '@api' }, async function () {
  apiHelper = new ApiHelper(await request.newContext(), process.env['ENVIRON']!)
  apiCurlHelper = new ApiCurlHelper(process.env['ENVIRON']!)
  this.token = ''
});
