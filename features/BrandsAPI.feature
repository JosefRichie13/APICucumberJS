@AutomatedTests
@BrandsAPI

Feature: Brands API

Scenario: Get All Brands endpoint
    Given I "get" all the Brands
    Then I should "be allowed to see" the Brands 

Scenario: Update All Brands endpoint
    Given I "update" all the Brands
    Then I should "not be allowed to update" the Brands 