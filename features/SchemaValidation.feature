@AutomatedTests
@BrandsAPI
@BrandsAPISchemaValidation

Feature: Brands API Schema Validation

Scenario: Get All Brands endpoint
    Given I "get_save" all the Brands
    Then I validate the "Brands API" Schema to ensure that it is not changed