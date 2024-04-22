# pw-api-test-automation
Cucumber/Playwright/Typescript API test automation

- [Technology overview](#technology-overview)
- [Running tests](#running-tests)
- [Results and reporting](#results-and-reporting)
- [Docker support](#docker-support)

### Technology overview

#### 1. Tools and approaches

`pw-api-test-automation` is modern automated API testing solution which uses (based on) the following tools and approaches:

- Multi-layered test automation framework structure
- Playwright - [https://playwright.dev/](https://playwright.dev/)
- CucumberJS - [https://cucumber.io/](https://cucumber.io/)

#### 2. Cucumber and Playwright

Cucumber is the industry standard for designing BDD-based frameworks and allows the code of tests to be easily readable and
maintainable. Cucumber scenarios are also the best when it comes to understanding of how functionality works and tested.

Cucumber with Playwright make a potent and flexible test automation solution which allows the following:

- Easy grouping of scenarios into sets (features)
- Selective test execution (Cucumber tags and tag expressions)
- Execution of setUp/tearDown code for the specific scenarios
- Support for UI, API or hybrid UI+API automated tests

### Running tests

In order to manually install the required dependencies please make sure that you are in the project's root folder
and execute the following command:

```sh
npm install
```

To run all tests locally execute the following command:

```sh
ENVIRON=STAGING npm run test
```

To run a particular scenario or a set of scenarios a Cucumber tag or tag expression should be specified:

```sh
ENVIRON=STAGING npm run test -- --tags='@api and not (@test_get_ip_address or @test_get)'
```

### Results and reporting

#### 1. Console output

During and after the test execution the following test execution related information will be displayed:

- Cucumber scenario steps being executed (via `pretty` formatter)
- Cucumber test results information - number of passed/failed scenarios and steps and overall run duration.

#### 2. Reports and logs

The following reports and logs are generated upon the test run completion:

- **Cucumber JSON** report - `reports/cucumber-report.json`
- **JUnit XML** report - `reports/cucumber-report.xml`
- **Multi-Cucumber-HTML** report - `reports/index.html`

### Docker support

`pw-api-test-automation` project fully supports and is intended to be run in the container environment.

To build `pw-api-test-automation` Docker image (using `Docker` or `Podman`) execute the following command:

```sh
podman build -t pw-api-tests .
```

To run `pw-api-test-automation` tests in a container (using `Docker` or `Podman`) execute the following command:

```sh
podman run -it -e ENVIRON=STAGING -e TAG='@api' pw-api-tests
```

Similar to test execution on a real computer it is possible to fetch all generated reports from the container.

Use the following command to copy the contents of `reports` folder (in the container) to the host:

```sh
 docker cp $(docker ps -alq):/tests/reports .
```

or

```sh
 podman cp $(podman ps -n 1 -q):/tests/reports .
```
