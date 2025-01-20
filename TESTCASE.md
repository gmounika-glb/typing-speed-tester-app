
# Typing Speed Tester App - Test Cases

## 1. Authentication

### Sign-Up Functionality

- **Test Case 1**: Verify that a user can sign up with valid credentials.
  - **Input**: Valid email, password, and username.
  - **Expected Output**: Account is created, and the user is redirected to the login page.

- **Test Case 2**: Verify that the system prevents sign-up with invalid email format.
  - **Input**: Invalid email, valid password, and username.
  - **Expected Output**: Error message like "Invalid email format."

- **Test Case 3**: Verify password strength validation during sign-up.
  - **Input**: Weak password (e.g., "123").
  - **Expected Output**: Error message like "Password must be at least 8 characters long."

### Login Functionality

- **Test Case 4**: Verify that a user can log in with correct credentials.
  - **Input**: Valid email and password.
  - **Expected Output**: User is logged in and redirected to the homepage.

- **Test Case 5**: Verify login fails with incorrect credentials.
  - **Input**: Invalid email or password.
  - **Expected Output**: Error message like "Invalid email or password."

- **Test Case 6**: Verify that a logged-in user cannot access the sign-up page without logging out.
  - **Expected Output**: Redirected to the homepage if trying to access the sign-up page.

---

## 2. Typing Speed Test

### Starting a Test

- **Test Case 7**: Verify that the test begins when the "Start" button is clicked.
  - **Action**: Click "Start".
  - **Expected Output**: Timer starts, and text is displayed for typing.

- **Test Case 8**: Verify that the timer stops after the test duration ends.
  - **Input**: Default test duration (e.g., 1 minute).
  - **Expected Output**: Timer stops at 0, and the results are displayed.

### Typing Accuracy and Speed Calculation

- **Test Case 9**: Verify that typing speed is calculated correctly (words per minute).
  - **Input**: User types 60 words in 1 minute.
  - **Expected Output**: Typing speed displayed as "60 WPM".

- **Test Case 10**: Verify that accuracy is calculated correctly.
  - **Input**: User types 50 correct words and 10 incorrect words out of 60 words.
  - **Expected Output**: Accuracy displayed as "83.33%".

- **Test Case 11**: Verify that backspace and corrections are handled accurately in results.
  - **Action**: User corrects mistakes while typing.
  - **Expected Output**: Final results reflect the corrected input.

### Edge Cases

- **Test Case 12**: Verify behavior when the user doesn't type anything during the test.
  - **Input**: No typing.
  - **Expected Output**: Typing speed: "0 WPM", Accuracy: "0%".

- **Test Case 13**: Verify that special characters in the text are handled properly.
  - **Input**: Text contains special characters like `@`, `#`, etc.
  - **Expected Output**: Results exclude errors caused by special characters.

---

## 3. Localstorage Operations

### Local Storage CRUD Operations

- **Test Case 14**: Verify that user test data is saved in MongoDB after test completion.
  - **Action**: Complete a test.
  - **Expected Output**: Data (e.g., WPM, accuracy, date) is stored in the database.

- **Test Case 15**: Verify that a user can view all their past test results.
  - **Action**: Access history page.
  - **Expected Output**: List of past results with details (WPM, accuracy, date).

- **Test Case 16**: Verify that a user can delete their test data.
  - **Action**: Delete specific test results.
  - **Expected Output**: Data is removed from the database.

---

## 4. Frontend and Responsiveness

### Responsive Design

- **Test Case 17**: Verify that the layout adjusts correctly on different screen sizes.
  - **Input**: Access app on desktop, tablet, and mobile.
  - **Expected Output**: Elements adapt to fit screen size (e.g., hamburger menu on mobile).

### Tooltips and UI Elements

- **Test Case 18**: Verify that tooltips appear when hovering over specific elements.
  - **Action**: Hover over buttons or inputs.
  - **Expected Output**: Tooltips with descriptions appear.

### Dark Mode Toggle

- **Test Case 19**: Verify that the app switches between light and dark modes.
  - **Action**: Toggle dark mode button.
  - **Expected Output**: App theme switches accordingly.

---

## 5. Error Handling

### Invalid Inputs

- **Test Case 20**: Verify behavior for invalid inputs in the sign-up and login forms.
  - **Input**: Empty fields or invalid formats.
  - **Expected Output**: Error messages and no data submission.

- **Test Case 21**: Verify the app handles server errors gracefully.
  - **Scenario**: Database connection fails during test data save.
  - **Expected Output**: Error message like "Unable to save data. Please try again later."
