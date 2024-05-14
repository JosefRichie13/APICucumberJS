@AutomatedTests
@UsersAPI

Feature: Users API

  Scenario: Users API Scenarios
    Given I verify that a random user "does not exist"
    When I create a random user
    And I verify that a random user "exists"
    And I update the random user
    And I verify the user "update"
    And I validate the "User API" Schema to ensure that it is not changed
    And I verify that a random user "cannot be searched without email"
    And I verify that a random user "cannot be deleted with the DELETE method"
    And I verify that a random user "cannot be searched with incorrect details"
    Then I delete a random user
    And I verify the user "delete"