# Smart Task Manager Microservices System

This project is a beginner-friendly microservices assignment built with Node.js and Express. It contains exactly four microservices that work together locally to provide authentication, task management, notification logging, and reporting.

## Project Overview

The goal of this project is to demonstrate:

- basic microservices architecture
- service-to-service communication
- JWT-based authentication
- practical security basics for backend services
- Swagger/OpenAPI documentation
- Docker readiness for future deployment

This version is intentionally built for local development first. It uses simple JSON files for storage so that the system is easy for beginners to understand and run.

## Microservices List

1. `auth-service` on port `5001`
2. `task-service` on port `5002`
3. `notification-service` on port `5003`
4. `report-service` on port `5004`

## Architecture Explanation

### Auth Service

Handles:

- user registration
- user login
- password hashing using `bcrypt`
- JWT generation
- protected profile access

### Task Service

Handles:

- task creation
- task listing
- task update
- task deletion
- notifying the Notification Service when tasks are created or updated

All task routes are protected by JWT authentication.

### Notification Service

Handles:

- receiving notification messages from the Task Service
- storing notification logs in a JSON file
- listing saved notifications

### Report Service

Handles:

- fetching task data from the Task Service
- calculating summary statistics
- returning total, completed, and pending task counts

The Report Service does not store task data.

## Service Communication Explanation

- `auth-service` creates JWT tokens after login.
- `task-service` validates those JWT tokens before allowing task operations.
- `task-service` sends a notification to `notification-service` when a task is created or updated.
- `report-service` requests task data from `task-service` and calculates summary counts.
- `auth-service`, `task-service`, and `report-service` share the same `JWT_SECRET` environment variable so authentication works consistently.

## Ports Table

| Service | Port | Purpose |
| --- | --- | --- |
| Auth Service | 5001 | Registration, login, profile |
| Task Service | 5002 | Task CRUD |
| Notification Service | 5003 | Notification logs |
| Report Service | 5004 | Task summary |

## Local Running Order

Start the services in this order:

1. `notification-service`
2. `task-service`
3. `auth-service`
4. `report-service`

## How To Run Locally

Open four terminals and run these commands.

### Terminal 1

```bash
cd smart-task-manager/notification-service
npm install
npm run dev
```

### Terminal 2

```bash
cd smart-task-manager/task-service
npm install
npm run dev
```

### Terminal 3

```bash
cd smart-task-manager/auth-service
npm install
npm run dev
```

### Terminal 4

```bash
cd smart-task-manager/report-service
npm install
npm run dev
```

You can also run `npm start` instead of `npm run dev`.

## Example Testing Flow

1. Start all four services in the order shown above.
2. Register a user using `auth-service`.
3. Login and copy the returned JWT token.
4. Create a task using `task-service` and the JWT token.
5. Check `notification-service` to confirm the task notification was stored.
6. Call `report-service` to get task summary statistics.

## Sample Postman Test Sequence

### 1. Register user

```http
POST http://localhost:5001/register
Content-Type: application/json

{
  "name": "John",
  "email": "john@example.com",
  "password": "123456"
}
```

### 2. Login

```http
POST http://localhost:5001/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "123456"
}
```

### 3. Create task

```http
POST http://localhost:5002/tasks
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "title": "Finish assignment",
  "status": "pending"
}
```

### 4. Confirm notification

```http
GET http://localhost:5003/notifications
```

### 5. Get summary

```http
GET http://localhost:5004/summary
```

## Swagger Documentation

Each service exposes Swagger UI at `/api-docs`:

- `http://localhost:5001/api-docs`
- `http://localhost:5002/api-docs`
- `http://localhost:5003/api-docs`
- `http://localhost:5004/api-docs`

## Docker Readiness

Each service includes:

- `Dockerfile`
- `.dockerignore`
- `.env.example`

This makes the project easy to containerize later.

## Future Deployment Note

This project is intentionally built for local learning first. Good next steps for the assignment would be:

- Docker Compose for multi-container local setup
- database integration instead of JSON files
- CI/CD pipeline setup
- container scanning and security checks
- cloud deployment

Those steps are not included here because the focus of this version is correctness, simplicity, and beginner-friendly architecture.
