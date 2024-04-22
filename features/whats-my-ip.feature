@api
Feature: WhatsMyIp

  @positive @test_get_ip_address
  Scenario: Test get (GET) request - obtain IP address from WhatsMyIP service

    When user executes "get ip address" request
    Then response code should be 200
     And response should have "content-type" header with "text/html" value
     And response body text should contain ip address

    When user executes "get ip address" request via curl
    Then response code should be 200
     And response should have "content-type" header with "text/html" value
     And response body text should contain ip address
