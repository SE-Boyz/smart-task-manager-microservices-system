# API Contracts (OpenAPI 3.0)

This document provides the API contracts for the microservices in the Smart Task Manager system.

## 1. Task Service API
**Base URL**: `https://task-service.jollycoast-3e03ff25.southeastasia.azurecontainerapps.io`

### Authentication
All endpoints (except health checks) require a Bearer JWT token in the `Authorization` header.

### Endpoints
- `GET /tasks`: Retrieve all tasks for the authenticated user.
- `POST /tasks`: Create a new task.
- `GET /tasks/:id`: Retrieve a specific task.
- `PUT /tasks/:id`: Update a task.
- `DELETE /tasks/:id`: Delete a task.

---

## 2. Auth Service API
**Base URL**: `https://auth-service.jollycoast-3e03ff25.southeastasia.azurecontainerapps.io`

### Endpoints
- `POST /auth/register`: Register a new user.
- `POST /auth/login`: Authenticate and receive a JWT.
- `GET /auth/profile`: Get the current user's profile.

---

## 3. API Gateway
**Base URL**: `https://api-gateway.jollycoast-3e03ff25.southeastasia.azurecontainerapps.io`

The Gateway acts as the single entry point, routing requests to the appropriate microservice based on the URL path (e.g., `/auth/*` -> Auth Service, `/tasks/*` -> Task Service).

---

## Inter-Service Communication Flow
1. **Synchronous (REST)**: The API Gateway communicates with Auth and Task services via REST calls.
2. **Asynchronous (Event-Driven)**: The Task Service publishes events (e.g., `TASK_CREATED`) to **RabbitMQ**. The **Notification Service** and **Audit Service** subscribe to these events to send emails and log actions without slowing down the main user flow.
