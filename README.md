## Authentication Routes

### POST /auth/login

- **Description:** User login.
- **Middleware:** None
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "user_password"
  }
  ```
- **Response (Success):**
  ```json
  {
    "token": "generated_jwt_token",
    "email": "user@example.com"
  }
  ```
- **Response (Failure):**
  ```json
  {
    "message": "Invalid email or password!",
    "status": 401
  }
  ```

### POST /auth/signup

- **Description:** User registration.
- **Middleware:** None
- **Request Body:**
  ```json
  {
    "email": "newuser@example.com",
    "password": "new_user_password"
  }
  ```
- **Response (Success):**
  ```json
  {
    "message": "User created successfully!",
    "status": 201
  }
  ```
- **Response (Failure):**
  ```json
  {
    "message": "Error creating user!",
    "status": 500
  }
  ```

### POST /auth/reset-password

- **Description:** Reset user password.
- **Middleware:** None
- **Request Body:**
  ```json
  {
    "email": "user@example.com"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Password reset successful!"
  }
  ```

## Board Routes

### GET /board

- **Description:** Get tasks for the authenticated user.
- **Middleware:** `isValidUser`
- **Response (Success):**
  ```json
  {
    "tasks": [...]
  }
  ```
- **Response (Failure):**
  ```json
  {
    "message": "Error fetching tasks!",
    "status": 500
  }
  ```

### POST /board

- **Description:** Create a new task for the authenticated user.
- **Middleware:** `isValidUser`
- **Request Body:**
  ```json
  {
    "title": "Task Title",
    "status": "Task Status"
  }
  ```
- **Response (Success):**
  ```json
  {
    "message": "Task created!",
    "status": 201
  }
  ```
- **Response (Failure):**
  ```json
  {
    "message": "Error creating tasks!",
    "status": 500
  }
  ```
### PUT /board

- **Description:** Update an existing task for the authenticated user.
- **Middleware:** `isValidUser`
- **Request Body:**
  ```json
  {
    "title": "Updated Task Title",
    "status": "Updated Task Status",
    "task_id": 123
  }
  ```
  ```
  {
  "message": "Task updated!",
  "status": 200
  }
  ```

### DELETE /board

- **Description:** Delete a task for the authenticated user.
- **Middleware:** `isValidUser`
- **Request Body:**
  ```json
  {
    "task_id": 123
  }
  ```
- **Response (Success):**
  ```json
  {
    "message": "Task deleted!",
    "status": 200
  }
  ```
- **Response (Failure):**
  ```json
  {
    "message": "Error deleting task!",
    "status": 500
  }
  ```
