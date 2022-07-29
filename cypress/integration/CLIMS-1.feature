@CLIMS-1
Feature: As a CLIMSOFT user I must be able to use auth features

  @CLIM-1-1
  Scenario: Scenario-1 As a user When I try to login into the climsoft app with blank form it shows validation errors
  Given I am on the login page
  When I click on the login button
  Then I am able to see the username textbox invalid status
  And I am able to see the username validation error message "Username is required"
  And I am able to see the password textbox invalid status
  And I am able to see the password validation error message "Password is required"

  @CLIM-1-2
  Scenario: Scenario-2 As a user When I try to login into the climsoft with wrong password it shows the login failure message
  Given I am on the login page
  And I enter the username in username textbox as "admin"
  And I enter incorrect password in password textbox
  When I click on the login button
  Then I am able to see the login failure error message "Authentication failed, Please try again."

  @CLIM-1-3
  Scenario: Scenario-3 As a user I am able to login into the climsoft app
  Given I am on the login page
  And I enter the username in username textbox as "admin"
  And I enter the password in password textbox as "password123"
  When I click on the login button
  Then I login successfully

  @CLIM-1-4
  Scenario: Scenario-4 As a user I am able to login into the climsoft app and land on my last visited page
  Given I am on the login page with return path "#/login?returnUrl=/data-entry/daily"
  And I enter the username in username textbox as "admin"
  And I enter the password in password textbox as "password123"
  When I click on the login button
  Then I login successfully with the right returnUrl "/data-entry/daily"
