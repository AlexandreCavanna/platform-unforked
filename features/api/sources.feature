@sources
Feature: Sources

### List

  @parallel-scenario
  Scenario: API client wants to list sources of an opinion
  When I send a GET request to "/api/opinions/2/sources"
  Then the JSON response should match:
  """
  {
    "sources": [
      {
        "id": @string@,
        "title": @string@,
        "category": {
          "id": @integer@,
          "title": @string@,
          "slug": @string@
        },
        "body": @string@,
        "link": @string@,
        "created_at": "@string@.isDateTime()",
        "updated_at": "@string@.isDateTime()",
        "votes_count": @integer@,
        "isContribuable": @boolean@,
        "author": {
          "username": @string@,
          "displayName": @string@,
          "uniqueId": @string@,
          "isAdmin": @boolean@,
          "vip": @boolean@,
          "media": @...@,
          "_links": {
            "profile": @string@,
            "settings": @string@
          }
        },
        "has_user_voted": @boolean@,
        "has_user_reported": @boolean@
      },
      @...@
    ],
    "count": @integer@
  }
  """

  @parallel-scenario
  Scenario: API client wants to list sources of a version
  When I send a GET request to "/api/opinions/57/versions/1/sources"
  Then the JSON response should match:
  """
  {
    "sources": [
      @...@
    ],
    "count": @integer@
  }
  """

## Create

  ### Opinion

  @security
  Scenario: Anonymous API client wants to add a source to an opinion
    When I send a POST request to "/api/opinions/1/sources" with a valid source json
    Then the JSON response status code should be 401

  @database
  Scenario: Logged in API client wants to add a source to an opinion
    Given I am logged in to api as user
    When I send a POST request to "/api/opinions/1/sources" with a valid source json
    Then the JSON response status code should be 201

  ### Version

  @security
  Scenario: Anonymous API client wants to add a source to an opinion version
    When I send a POST request to "/api/opinions/57/versions/1/sources" with a valid source json
    Then the JSON response status code should be 401

  @database
  Scenario: Logged in API client wants to add a source to an opinion version
    Given I am logged in to api as user
    When I send a POST request to "/api/opinions/57/versions/1/sources" with a valid source json
    Then the JSON response status code should be 201

## Update

  ### Opinion

  @security
  Scenario: Anonymous API client wants to update a source
    When I send a PUT request to "/api/opinions/3/sources/1" with a valid source json
    Then the JSON response status code should be 401

  @security
  Scenario: Logged in API client wants to update a source but is not the author
    Given I am logged in to api as admin
    When I send a PUT request to "/api/opinions/3/sources/1" with a valid source json
    Then the JSON response status code should be 403

  @database
  Scenario: Logged in API client wants to update his source
    Given I am logged in to api as user
    When I send a PUT request to "/api/opinions/3/sources/1" with a valid source json
    Then the JSON response status code should be 200

  ### Version

  @security
  Scenario: Anonymous API client wants to update a source
    When I send a PUT request to "/api/opinions/57/versions/1/sources/31" with a valid source json
    Then the JSON response status code should be 401

  @security
  Scenario: Logged in API client wants to update a source but is not the author
    Given I am logged in to api as admin
    When I send a PUT request to "/api/opinions/57/versions/1/sources/31" with a valid source json
    Then the JSON response status code should be 403

  @database
  Scenario: Logged in API client wants to update his source
    Given I am logged in to api as user
    When I send a PUT request to "/api/opinions/57/versions/1/sources/31" with a valid source json
    Then the JSON response status code should be 200

## Delete

  ### Opinion

  @security
  Scenario: Anonymous API client wants to delete a source
    When I send a DELETE request to "/api/opinions/3/sources/1"
    Then the JSON response status code should be 401

  @security
  Scenario: Logged in API client wants to delete a source but is not the author
    Given I am logged in to api as admin
    When I send a DELETE request to "/api/opinions/3/sources/1"
    Then the JSON response status code should be 403

  @database
  Scenario: Logged in API client wants to delete his source
    Given I am logged in to api as user
    When I send a DELETE request to "/api/opinions/3/sources/1"
    Then the JSON response status code should be 204


  ### Version

  @security
  Scenario: Anonymous API client wants to delete a source
    When I send a DELETE request to "/api/opinions/57/versions/1/sources/31"
    Then the JSON response status code should be 401

  @security
  Scenario: Logged in API client wants to delete a source but is not the author
    Given I am logged in to api as admin
    When I send a DELETE request to "/api/opinions/57/versions/1/sources/31"
    Then the JSON response status code should be 403

  @database
  Scenario: Logged in API client wants to delete his source
    Given I am logged in to api as user
    When I send a DELETE request to "/api/opinions/57/versions/1/sources/31"
    Then the JSON response status code should be 204

## Vote

  @security
  Scenario: Anonymous API client wants to add a vote
    When I send a POST request to "/api/sources/1/votes" with json:
    """
    {}
    """
    Then the JSON response status code should be 401

  @database
  Scenario: logged in API client wants to add and delete a vote
    Given I am logged in to api as user
    When I send a POST request to "/api/sources/1/votes" with json:
    """
    {}
    """
    Then the JSON response status code should be 201
    When I send a DELETE request to "/api/sources/1/votes"
    Then the JSON response status code should be 204

  @security
  Scenario: logged in API client wants to delete a vote that doesn't exist
    Given I am logged in to api as user
    When I send a DELETE request to "/api/sources/1/votes"
    Then the JSON response status code should be 400
    And the JSON response should match:
    """
    {
      "code": 400,
      "message": "You have not voted for this source.",
      "errors": @null@
    }
    """

## Reporting

  # Opinion
  @security
  Scenario: Anonymous API client wants to add a report
    When I send a POST request to "/api/opinions/3/sources/1/reports" with a valid report json
    Then the JSON response status code should be 401

  @security
  Scenario: Logged in API client wants to report his source
    Given I am logged in to api as user
    When I send a POST request to "/api/opinions/3/sources/1/reports" with a valid report json
    Then the JSON response status code should be 403

  @database
  Scenario: Logged in API client wants to report a source
    Given I am logged in to api as admin
    When I send a POST request to "/api/opinions/3/sources/1/reports" with a valid report json
    Then the JSON response status code should be 201

  # OpinionVersion
  @security
  Scenario: Anonymous API client wants to add a report
    When I send a POST request to "/api/opinions/57/versions/1/sources/31/reports" with a valid report json
    Then the JSON response status code should be 401

  @security
  Scenario: Logged in API client wants to report his source
    Given I am logged in to api as user
    When I send a POST request to "/api/opinions/57/versions/1/sources/31/reports" with a valid report json
    Then the JSON response status code should be 403

  @database
  Scenario: Logged in API client wants to report a source
    Given I am logged in to api as admin
    When I send a POST request to "/api/opinions/57/versions/1/sources/31/reports" with a valid report json
    Then the JSON response status code should be 201
