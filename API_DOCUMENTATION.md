# Smart Task Manager API Documentation

This document describes all HTTP APIs exposed by the Smart Task Manager microservices system.

## Overview

### Services and default ports

| Service | Default Port | Purpose |
| --- | --- | --- |
| API Gateway | `5000` | Single public entry point |
| Auth Service | `5001` | Registration, login, profile |
| Task Service | `5002` | Task CRUD |
| Notification Service | `5003` | Notification log storage |
| Report Service | `5004` | Task summary generation |

### Recommended base URL for clients

Use the API Gateway for client-facing requests:

- Gateway base URL: `http://localhost:5000`

Direct service base URLs:

- Auth Service: `http://localhost:5001`
- Task Service: `http://localhost:5002`
- Notification Service: `http://localhost:5003`
- Report Service: `http://localhost:5004`

### Gateway route mapping

| Gateway Route | Downstream Service Route |
| --- | --- |
| `/auth/register` | Auth Service `POST /register` |
| `/auth/login` | Auth Service `POST /login` |
| `/auth/profile` | Auth Service `GET /profile` |
| `/tasks` | Task Service `/tasks` |
| `/tasks/:id` | Task Service `/tasks/:id` |
| `/notifications` | Notification Service `GET /notifications` |
| `/notifications/notify` | Notification Service `POST /notify` |
| `/reports/summary` | Report Service `GET /summary` |

## Authentication

### JWT authentication

The Auth Service issues JWT bearer tokens. Protected routes require:

```http
Authorization: Bearer <token>
```

### Protected routes

- `GET /auth/profile`
- `GET /tasks`
- `POST /tasks`
- `PUT /tasks/:id`
- `DELETE /tasks/:id`

### Token behavior

- Login tokens include `id`, `name`, and `email`.
- Tokens expire in `1 hour`.
- The Report Service creates its own internal service token with `role: "service"` to fetch all tasks from the Task Service.

## Common Response Patterns

### Validation error

Routes using request validation return:

```json
{
  "message": "Validation failed",
  "errors": [
    {
      "type": "field",
      "msg": "Title is required",
      "path": "title",
      "location": "body"
    }
  ]
}
```

### Common error responses

```json
{
  "message": "Authorization token is required"
}
```

```json
{
  "message": "Invalid or expired token"
}
```

```json
{
  "message": "Resource already exists"
}
```

```json
{
  "message": "Database is unavailable"
}
```

```json
{
  "message": "Something went wrong"
}
```

## API Gateway

Base URL: `http://localhost:5000`

The gateway forwards requests to downstream services and returns their responses.

### GET `/health`

Checks gateway availability.

#### Response `200`

```json
{
  "service": "api-gateway",
  "status": "ok"
}
```

### Gateway-specific error response

If a mapped downstream service is offline:

#### Response `503`

```json
{
  "message": "Downstream service is unavailable."
}
```

If no route mapping exists:

#### Response `404`

```json
{
  "message": "No downstream service mapping found for this route."
}
```

## Auth Service

Direct base URL: `http://localhost:5001`

Gateway base URL: `http://localhost:5000/auth`

### Data model

```json
{
  "id": "uuid",
  "name": "John Doe",
  "email": "john@example.com"
}
```

Stored user records also contain a hashed `password`, but it is never returned in API responses.

### GET `/`

Direct service root endpoint.

#### Response `200`

```json
{
  "message": "Auth Service is running"
}
```

### GET `/health`

#### Response `200`

```json
{
  "service": "auth-service",
  "status": "ok",
  "database": "connected"
}
```

Possible `database` values: `disconnected`, `connecting`, `connected`, `error`.

### GET `/api-docs`

Swagger UI for the Auth Service.

### POST `/register`

Gateway URL: `POST http://localhost:5000/auth/register`

Creates a new user account.

#### Request body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}
```

#### Validation rules

- `name` is required
- `email` must be a valid email
- `password` must be at least 6 characters

#### Response `201`

```json
{
  "message": "User registered successfully"
}
```

#### Error responses

- `400` validation failed
- `409` user already exists

Example `409`:

```json
{
  "message": "User already exists"
}
```

### POST `/login`

Gateway URL: `POST http://localhost:5000/auth/login`

Authenticates a user and returns a JWT.

#### Request body

```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

#### Validation rules

- `email` must be valid
- `password` is required

#### Response `200`

```json
{
  "message": "Login successful",
  "token": "jwt-token-here"
}
```

#### Error responses

- `400` validation failed
- `401` invalid credentials

Example `401`:

```json
{
  "message": "Invalid email or password"
}
```

### GET `/profile`

Gateway URL: `GET http://localhost:5000/auth/profile`

Returns the logged-in user's profile.

#### Headers

```http
Authorization: Bearer <token>
```

#### Response `200`

```json
{
  "id": "b76c2b82-1234-4d0a-9f88-2e1c0a63b18d",
  "name": "John Doe",
  "email": "john@example.com"
}
```

#### Error responses

- `401` missing or invalid token
- `404` user not found

## Task Service

Direct base URL: `http://localhost:5002`

Gateway base URL: `http://localhost:5000`

### Data model

```json
{
  "id": "uuid",
  "userId": "user-uuid",
  "title": "Finish assignment",
  "status": "pending",
  "createdAt": "2026-03-21T10:00:00.000Z",
  "updatedAt": "2026-03-21T10:00:00.000Z"
}
```

### Business rules

- All public task routes require a JWT.
- `status` must be either `pending` or `completed`.
- Normal users can only update or delete their own tasks.
- Internal service tokens with `role: "service"` can read all tasks and modify any task.
- Creating and updating a task triggers a notification to the Notification Service.
- Task creation and update still succeed even if the Notification Service is unavailable.

### GET `/health`

#### Response `200`

```json
{
  "service": "task-service",
  "status": "ok",
  "database": "connected"
}
```

### GET `/api-docs`

Swagger UI for the Task Service.

### GET `/tasks`

Gateway URL: `GET http://localhost:5000/tasks`

Returns tasks for the authenticated user.

#### Headers

```http
Authorization: Bearer <token>
```

#### Response `200` for a normal user

```json
{
  "tasks": [
    {
      "id": "0df8f5ab-0d8d-4e4d-8f53-96c6458d6377",
      "userId": "b76c2b82-1234-4d0a-9f88-2e1c0a63b18d",
      "title": "Finish assignment",
      "status": "pending",
      "createdAt": "2026-03-21T10:00:00.000Z",
      "updatedAt": "2026-03-21T10:00:00.000Z"
    }
  ]
}
```

#### Internal behavior

If the token contains `role: "service"`, the service returns all tasks in the system instead of user-scoped tasks.

#### Error responses

- `401` missing or invalid token

### POST `/tasks`

Gateway URL: `POST http://localhost:5000/tasks`

Creates a task for the authenticated user.

#### Headers

```http
Authorization: Bearer <token>
Content-Type: application/json
```

#### Request body

```json
{
  "title": "Finish assignment",
  "status": "pending"
}
```

#### Validation rules

- `title` is required
- `status` must be `pending` or `completed`

#### Response `201`

```json
{
  "message": "Task created successfully",
  "task": {
    "id": "0df8f5ab-0d8d-4e4d-8f53-96c6458d6377",
    "userId": "b76c2b82-1234-4d0a-9f88-2e1c0a63b18d",
    "title": "Finish assignment",
    "status": "pending",
    "createdAt": "2026-03-21T10:00:00.000Z",
    "updatedAt": "2026-03-21T10:00:00.000Z"
  }
}
```

#### Error responses

- `400` validation failed
- `401` missing or invalid token

### PUT `/tasks/:id`

Gateway URL: `PUT http://localhost:5000/tasks/{taskId}`

Updates a task.

#### Headers

```http
Authorization: Bearer <token>
Content-Type: application/json
```

#### Path parameters

- `id`: task UUID

#### Request body

```json
{
  "title": "Finish assignment quickly",
  "status": "completed"
}
```

#### Validation rules

- `id` is required
- `title` is required
- `status` must be `pending` or `completed`

#### Response `200`

```json
{
  "message": "Task updated successfully",
  "task": {
    "id": "0df8f5ab-0d8d-4e4d-8f53-96c6458d6377",
    "userId": "b76c2b82-1234-4d0a-9f88-2e1c0a63b18d",
    "title": "Finish assignment quickly",
    "status": "completed",
    "createdAt": "2026-03-21T10:00:00.000Z",
    "updatedAt": "2026-03-21T10:30:00.000Z"
  }
}
```

#### Error responses

- `400` validation failed
- `401` missing or invalid token
- `403` task belongs to another user
- `404` task not found

Example `403`:

```json
{
  "message": "You are not allowed to update this task"
}
```

### DELETE `/tasks/:id`

Gateway URL: `DELETE http://localhost:5000/tasks/{taskId}`

Deletes a task.

#### Headers

```http
Authorization: Bearer <token>
```

#### Path parameters

- `id`: task UUID

#### Response `200`

```json
{
  "message": "Task deleted successfully"
}
```

#### Error responses

- `400` validation failed
- `401` missing or invalid token
- `403` task belongs to another user
- `404` task not found

Example `403`:

```json
{
  "message": "You are not allowed to delete this task"
}
```

## Notification Service

Direct base URL: `http://localhost:5003`

Gateway base URL: `http://localhost:5000/notifications`

### Data model

```json
{
  "id": "uuid",
  "message": "Task created: Finish assignment",
  "createdAt": "2026-03-21T10:00:00.000Z"
}
```

### Business rules

- No authentication is required.
- Notifications are stored as log records.
- Records are returned in descending `createdAt` order.

### GET `/health`

#### Response `200`

```json
{
  "service": "notification-service",
  "status": "ok",
  "database": "connected"
}
```

### GET `/api-docs`

Swagger UI for the Notification Service.

### POST `/notify`

Direct URL: `POST http://localhost:5003/notify`

Gateway URL: `POST http://localhost:5000/notifications/notify`

Stores a notification log entry.

#### Request body

```json
{
  "message": "Task created: Finish assignment"
}
```

#### Validation rules

- `message` is required

#### Response `201`

```json
{
  "message": "Notification stored successfully",
  "notification": {
    "id": "e7e2a70b-4b97-4f92-90d3-c73837cfb7fd",
    "message": "Task created: Finish assignment",
    "createdAt": "2026-03-21T10:00:00.000Z"
  }
}
```

#### Error responses

- `400` validation failed

### GET `/notifications`

Direct URL: `GET http://localhost:5003/notifications`

Gateway URL: `GET http://localhost:5000/notifications`

Returns all stored notification logs.

#### Response `200`

```json
{
  "notifications": [
    {
      "id": "e7e2a70b-4b97-4f92-90d3-c73837cfb7fd",
      "message": "Task updated: Finish assignment quickly",
      "createdAt": "2026-03-21T10:30:00.000Z"
    },
    {
      "id": "601be28b-1655-485c-871c-7f51fa9435a3",
      "message": "Task created: Finish assignment",
      "createdAt": "2026-03-21T10:00:00.000Z"
    }
  ]
}
```

## Report Service

Direct base URL: `http://localhost:5004`

Gateway base URL: `http://localhost:5000/reports`

### Data model

```json
{
  "total": 8,
  "completed": 3,
  "pending": 5,
  "generatedAt": "2026-03-21T11:00:00.000Z"
}
```

### Business rules

- No external authentication is required.
- The service fetches tasks from the Task Service using an internal JWT with `role: "service"`.
- A summary snapshot is saved to the report database every time the endpoint is called.

### GET `/health`

#### Response `200`

```json
{
  "service": "report-service",
  "status": "ok",
  "database": "connected"
}
```

### GET `/api-docs`

Swagger UI for the Report Service.

### GET `/summary`

Direct URL: `GET http://localhost:5004/summary`

Gateway URL: `GET http://localhost:5000/reports/summary`

Returns a generated task summary.

#### Response `200`

```json
{
  "total": 8,
  "completed": 3,
  "pending": 5,
  "generatedAt": "2026-03-21T11:00:00.000Z"
}
```

#### Error responses

- `503` if Task Service or database is unavailable
- mirrors downstream task-service status when task retrieval fails

Example downstream failure response:

```json
{
  "message": "Failed to fetch tasks from Task Service"
}
```

## End-to-End Client Examples Through Gateway

### 1. Register

```http
POST http://localhost:5000/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}
```

### 2. Login

```http
POST http://localhost:5000/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "123456"
}
```

### 3. Create task

```http
POST http://localhost:5000/tasks
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "title": "Finish assignment",
  "status": "pending"
}
```

### 4. List tasks

```http
GET http://localhost:5000/tasks
Authorization: Bearer YOUR_TOKEN
```

### 5. View notifications

```http
GET http://localhost:5000/notifications
```

### 6. Get report summary

```http
GET http://localhost:5000/reports/summary
```

## Swagger UI Links

Direct Swagger UIs exposed by services:

- Auth Service: `http://localhost:5001/api-docs`
- Task Service: `http://localhost:5002/api-docs`
- Notification Service: `http://localhost:5003/api-docs`
- Report Service: `http://localhost:5004/api-docs`

The API Gateway does not expose its own Swagger UI in the current codebase.
