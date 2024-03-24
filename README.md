The Contact List App Framework is designed to thoroughly test the account creation, login, and contact creation functionalities of a web application.
It aims to ensure that user interactions related to account management are reliable.

Account Creation Testing:

Automated tests are designed to simulate user interactions for registering a new account on the application.
Tests verify that the registration form accepts valid user inputs such as email address, etc.
Edge cases and invalid inputs are also tested to ensure robustness and error handling.

Account Login Testing:

Automated tests validate the login process by entering valid credentials and verifying successful authentication.
Tests cover scenarios such as incorrect passwords and invalid usernames

User Data Creation Testing:

Tests simulate user interactions to create and manage data within the application.
Data creation forms and functionalities are tested for accuracy, completeness, and data validation.
Tests verify that user-generated data is stored correctly in the database and accessible to the user as expected.

End-to-End Testing:

End-to-end tests cover the entire user journey from account creation to data creation and management.
These tests ensure that all components of the application interact seamlessly and produce the desired outcomes for users.

Cross-Browser Testing:

Tests are executed across multiple browsers (e.g., chromium, firefox, webkit) to ensure compatibility and consistency.

Page Object Model:

The test defines dedicated Page Objects for the login, registration, add contacts and contacts page encapsulating all the elements and methods related to the previous functionalities.

Comprehensive test reports are generated after each test run, highlighting test results, including passed, failed, and skipped tests.

----------------------------------------------------------------------------------------------------------------------------------------------------------

In order to run the tests please type in console "npm i" first to get the packages and then "npx playwright test --project chromium --debug" to run the test step by step in debug mode. You can change browser from chromium to firefox or webkit if you want

We used Playwright framework for its robustness, locator targeting capabilities and detailed execution/reporting. We used JavaScript because it is a known, versatile and widely-supported language, empowered by Playwright

Improvements are added as Comment Anchors (ExodiusStudios.comment-anchors) within the main test file
