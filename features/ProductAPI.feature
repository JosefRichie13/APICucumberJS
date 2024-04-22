@AutomatedTests
@ProductAPI

Feature: Product API

Scenario: Get All Products endpoint
    Given I "get" all the Products
    Then I should "be allowed to see" the products 

Scenario: Update All Products endpoint
    Given I "update" all the Products
    Then I should "not be allowed to update" the products

Scenario: Search a product endpoint
    Given I search for a product using
    |search_product | 
    |Jeans|
    Then I should "get" the product search result    

Scenario: Search without the search param
    Given I search for a product using
    |search_product | 
    ||
    Then I should "not get" the product search result        