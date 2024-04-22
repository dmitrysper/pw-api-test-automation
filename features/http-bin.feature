@api
Feature: HTTPBin HTTP requests simulation service

  @positive @test_get
  Scenario: Test parameterised get (GET) request

    When user executes "test get" request with "Jon" and "Robertson" parameters
    Then response code should be 200
     And response should have "content-type" header with "application/json" value
     And response payload should have "args.firstname" property with "Jon" value
     And response payload should have "args.lastname" property with "Robertson" value

    When user executes "test get" request with "Jon" and "Robertson" parameters via curl
    Then response code should be 200
     And response should have "content-type" header with "application/json" value
     And response payload should have "args.firstname" property with "Jon" value
     And response payload should have "args.lastname" property with "Robertson" value

  @positive @test_post
  Scenario: Test create (POST) request

    When user executes "test post" request
    Then response code should be 200
     And response should have "content-type" header with "application/json" value
     And response payload should have "json.firstname" property with "Steve" value
     And response payload should have "json.lastname" property with "Stevenson" value

    When user executes "test post" request via curl
    Then response code should be 200
     And response should have "content-type" header with "application/json" value
     And response payload should have "json.firstname" property with "Steve" value
     And response payload should have "json.lastname" property with "Stevenson" value

  @positive @test_put
  Scenario: Test modify (PUT) request

    When user executes "test put" request with "Jon" and "Robertson" parameters
    Then response code should be 200
     And response should have "content-type" header with "application/json" value
     And response payload should have "json.firstname" property with "Jon" value
     And response payload should have "json.lastname" property with "Robertson" value

    When user executes "test put" request with "Jon" and "Robertson" parameters via curl
    Then response code should be 200
     And response should have "content-type" header with "application/json" value
     And response payload should have "json.firstname" property with "Jon" value
     And response payload should have "json.lastname" property with "Robertson" value
