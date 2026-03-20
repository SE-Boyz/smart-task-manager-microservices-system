# Task Service

## Purpose

This service handles:

- creating tasks
- listing tasks
- updating tasks
- deleting tasks
- sending notifications to the Notification Service
- persisting tasks in MongoDB

All routes in this service require a valid JWT token.

## Port

`5002`

## Endpoints

- `GET /tasks`
- `POST /tasks`
- `PUT /tasks/:id`
- `DELETE /tasks/:id`
- `GET /health`
- `GET /api-docs`

## How To Run

```bash
npm install
npm run dev
```

Or:

```bash
npm start
```

## Environment Variables

```env
PORT=5002
JWT_SECRET=your_jwt_secret
NOTIFICATION_SERVICE_URL=http://localhost:5003
MONGODB_URI=mongodb+srv://tharindulakshita2001_db_user:your_db_password@cluster0.pjnypci.mongodb.net/?appName=Cluster0
MONGODB_DB_NAME=task_service_db
```

## Example Requests

### Get Tasks

```http
GET http://localhost:5002/tasks
Authorization: Bearer YOUR_TOKEN
```

### Create Task

```http
POST http://localhost:5002/tasks
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "title": "Finish assignment",
  "status": "pending"
}
```

### Update Task

```http
PUT http://localhost:5002/tasks/TASK_ID
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "title": "Finish assignment quickly",
  "status": "completed"
}
```

### Delete Task

```http
DELETE http://localhost:5002/tasks/TASK_ID
Authorization: Bearer YOUR_TOKEN
```
