# Smart Task Manager Microservices System

This project is a beginner-friendly microservices assignment built with Node.js and Express. It now contains four backend microservices plus an API gateway, with each service owning an independent MongoDB database.

## Project Overview

The goal of this project is to demonstrate:

- basic microservices architecture
- service-to-service communication
- JWT-based authentication
- practical security basics for backend services
- Swagger/OpenAPI documentation
- Docker readiness for future deployment
- database-per-service isolation with MongoDB Atlas
- centralized ingress through an API gateway

This version is intentionally built for local development first. Each service connects to the same MongoDB cluster using a different database name, which keeps data ownership aligned with microservices best practices.

## Microservices List

1. `api-gateway` on port `5000`
2. `auth-service` on port `5001`
3. `task-service` on port `5002`
4. `notification-service` on port `5003`
5. `report-service` on port `5004`

## Architecture Explanation

### Auth Service

Handles:

- user registration
- user login
- password hashing using `bcrypt`
- JWT generation
- protected profile access
- data storage in `auth_service_db`

### Task Service

Handles:

- task creation
- task listing
- task update
- task deletion
- notifying the Notification Service when tasks are created or updated
- data storage in `task_service_db`

All task routes are protected by JWT authentication.

### Notification Service

Handles:

- receiving notification messages from the Task Service
- storing notification logs in MongoDB
- listing saved notifications
- data storage in `notification_service_db`

### Report Service

Handles:

- fetching task data from the Task Service
- calculating summary statistics
- returning total, completed, and pending task counts
- persisting generated report snapshots in `report_service_db`

The Report Service does not store task data.

### API Gateway

Handles:

- a single external entry point
- route-based forwarding to downstream services
- cleaner client access patterns for auth, tasks, notifications, and reports

## Service Communication Explanation

- `api-gateway` accepts client requests and forwards them to the correct downstream service.
- `auth-service` creates JWT tokens after login.
- `task-service` validates those JWT tokens before allowing task operations.
- `task-service` sends a notification to `notification-service` when a task is created or updated.
- `report-service` requests task data from `task-service`, calculates summary counts, and stores summary snapshots in its own database.
- `auth-service`, `task-service`, and `report-service` share the same `JWT_SECRET` environment variable so authentication works consistently.
- each service uses the same MongoDB Atlas cluster URI but a different `MONGODB_DB_NAME`.

## Ports Table

| Service | Port | Purpose |
| --- | --- | --- |
| API Gateway | 5000 | Public entry point |
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
5. `api-gateway`

## How To Run Locally

Open five terminals and run these commands after creating `.env` files from each service's `.env.example`.

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

### Terminal 5

```bash
cd smart-task-manager/api-gateway
npm install
npm run dev
```

You can also run `npm start` instead of `npm run dev`.

## Example Testing Flow

1. Start all services in the order shown above.
2. Register a user using the API gateway.
3. Login and copy the returned JWT token.
4. Create a task using the API gateway and the JWT token.
5. Check notifications through the API gateway.
6. Call reports through the API gateway to get task summary statistics.

## Sample Postman Test Sequence

### 1. Register user

```http
POST http://localhost:5000/auth/register
Content-Type: application/json

{
  "name": "John",
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

### 4. Confirm notification

```http
GET http://localhost:5000/notifications
```

### 5. Get summary

```http
GET http://localhost:5000/reports/summary
```

## Swagger Documentation

Each service exposes Swagger UI at `/api-docs`:

- `http://localhost:5001/api-docs`
- `http://localhost:5002/api-docs`
- `http://localhost:5003/api-docs`
- `http://localhost:5004/api-docs`

The gateway exposes a health check at `http://localhost:5000/health`.

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
