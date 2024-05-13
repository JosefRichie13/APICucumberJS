@AutomatedTests
@BrandsAPI
@BrandsAPISchemaValidation

Feature: API Schema Validation

Scenario: All Brands endpoint Schema validation
    Given I "get_save" all the Brands
    Then I validate the "Brands API" Schema to ensure that it is not changed

Scenario: All Products endpoint Schema validation
    Given I "get_save" all the Products
    Then I validate the "Products API" Schema to ensure that it is not changed