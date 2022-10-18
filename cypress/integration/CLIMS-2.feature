@CLIMS-2
Feature: As a CLIMSOFT user I must be able to login and open the Stations list view

  @CLIM-2-1
  Scenario: Scenario-1 - User should be able to login and view the stations list
    Given I am able to login successfully
    When I click on the stations link on the side navigation
    Then I am able to see the stations view
    And I am able to see the pagination control
    And I am able to see the items per page control
    And I am able to see the stations loaded in the table

  @CLIM-2-2
  Scenario: Scenario-2 - User should be able to load more records per page on the stations view
    Given I am able to login successfully
    And I click on the stations link on the side navigation
    And I am able to see the stations view
    When I click on the "20" button on the page limit control
    Then I am able to see "20" stations loaded in the table

  @CLIM-2-3
  Scenario: Scenario-3 - User should be able to load the next page on the stations view
    Given I am able to login successfully
    And I click on the stations link on the side navigation
    And I am able to see the stations view
    When I click on the page "2" button on the pagination control
    Then I am able to see page "2" button active
    And I am able to see the next page results loaded

  @CLIM-2-4
  Scenario: Scenario-4 - User should be able to view a station by clicking a row in stations table view
    Given I am able to login successfully
    And I click on the stations link on the side navigation
    And I am able to see the stations view
    And I am able to see the stations loaded in the table
    When I click on the first row item details button in the table
    Then I am able to see station details view
