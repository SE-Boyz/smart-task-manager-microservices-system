# Smart Task Manager Microservices System

This project is a beginner-friendly microservices assignment built with Node.js and Express. It now contains five backend microservices plus an API gateway, with each service owning an independent MongoDB database.
RabbitMQ is used for asynchronous task events between services where event-driven communication makes sense

## Project Overview

The goal of this project is to demonstrate:

- basic microservices architecture
- service-to-service communication
- hybrid communication with HTTP plus event-driven messaging
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
6. `audit-service` on port `5005`

## Architecture Explanation

### Auth Service

Handles:

- user registration
- user login
- password hashing using `bcrypt`
- JWT generation
- protected profile access
- publishing user lifecycle events to RabbitMQ
- data storage in `auth_service_db`

### Task Service

Handles:

- task creation
- task listing
- task update
- task deletion
- publishing task lifecycle events after writes succeed
- data storage in `task_service_db`

All task routes are protected by JWT authentication.

### Notification Service

Handles:

- consuming task lifecycle events from RabbitMQ
- storing notification logs in MongoDB
- listing saved notifications
- data storage in `notification_service_db`

### Report Service

Handles:

- consuming task lifecycle events from RabbitMQ
- maintaining a local task projection inside `report_service_db`
- calculating summary statistics from that projection
- returning total, completed, and pending task counts
- data storage in `report_service_db`

The Report Service does not call the Task Service for summary reads. It builds its own read model from events.

### Audit Service

Handles:

- consuming auth lifecycle events from RabbitMQ
- storing user registration and login audit logs in MongoDB
- returning authenticated users their own audit history and summary
- data storage in `audit_service_db`

### API Gateway

Handles:

- a single external entry point
- route-based forwarding to downstream services
- cleaner client access patterns for auth, tasks, notifications, and reports

## Service Communication Explanation

- `api-gateway` accepts client requests and forwards them to the correct downstream service.
- `auth-service` creates JWT tokens after login and publishes user lifecycle events.
- `task-service` validates those JWT tokens locally with the auth public key before allowing task operations.
- `task-service` handles synchronous task CRUD over HTTP because the caller needs an immediate response.
- `task-service` publishes task lifecycle events to RabbitMQ after writes succeed.
- `notification-service` consumes those events and stores notification logs.
- `report-service` consumes the same task events and maintains its own local projection for reporting queries.
- `audit-service` consumes auth events and stores a user-level audit trail.
- `auth-service` signs tokens with `JWT_PRIVATE_KEY`, while downstream services verify them with `JWT_PUBLIC_KEY`.
- each service uses the same MongoDB Atlas cluster URI but a different `MONGODB_DB_NAME`.

## Ports Table

| Service | Port | Purpose |
| --- | --- | --- |
| API Gateway | 5000 | Public entry point |
| Auth Service | 5001 | Registration, login, profile |
| Task Service | 5002 | Task CRUD |
| Notification Service | 5003 | Notification logs |
| Report Service | 5004 | Task summary |
| Audit Service | 5005 | Auth event audit trail |

## Local Running Order

Start the services in this order:

1. `rabbitmq`
2. `task-service`
3. `notification-service`
4. `report-service`
5. `auth-service`
6. `audit-service`
7. `api-gateway`

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
5. Check notifications through the API gateway after the async consumer processes the event.
6. Check audit logs through the API gateway after login or registration events are consumed.
7. Call reports through the API gateway to get summary statistics built from the report projection.

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

### 6. Get audit logs

```http
GET http://localhost:5000/audit-logs
Authorization: Bearer YOUR_TOKEN
```

## Swagger Documentation

Each service exposes Swagger UI at `/api-docs`:

- `http://localhost:5001/api-docs`
- `http://localhost:5002/api-docs`
- `http://localhost:5003/api-docs`
- `http://localhost:5004/api-docs`
- `http://localhost:5005/api-docs`

The gateway exposes a health check at `http://localhost:5000/health`.

## Docker Readiness

Each service includes:

- `Dockerfile`
- `.dockerignore`
- `.env.example`

This makes the project easy to containerize later.

## Practical Architecture Notes

- External client traffic stays on HTTP through the API gateway.
- Internal synchronous calls stay on HTTP only where the caller needs an immediate answer, such as gateway to auth/task/report/notification reads.
- Internal asynchronous fan-out uses RabbitMQ for task lifecycle events.
- `auth-service` and `audit-service` now form a second event-driven integration, so the authentication domain is no longer isolated.
- `notification-service` and `report-service` are intentionally event-driven consumers so they stay decoupled from `task-service`.
- The reporting tradeoff is eventual consistency: a new task may appear in the report summary a moment after the write succeeds.

## Future Deployment Note

This project is intentionally built for local learning first. Good next steps for the assignment would be:

- Docker Compose for multi-container local setup
- database integration instead of JSON files
- CI/CD pipeline setup
- container scanning and security checks
- cloud deployment

Those steps are not included here because the focus of this version is correctness, simplicity, and beginner-friendly architecture.
