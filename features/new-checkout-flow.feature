Feature: New Checkout Flow
  As a user
  I want to checkout with new payment methods
  So that I can complete my purchase

  Scenario: Complete checkout with new payment method
    Given I am logged in as a standard user
    When I add items to cart
    And I proceed to checkout
    Then I should see new payment options
    And I should be able to complete checkout

  Scenario: Checkout with saved payment method
    Given I have a saved payment method
    When I proceed to checkout
    Then I should see my saved payment method
    And I should be able to use it for checkout
