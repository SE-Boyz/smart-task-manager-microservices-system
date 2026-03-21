# Notification Service

## Purpose

This service handles:

- consuming task events from RabbitMQ
- storing notification logs in MongoDB
- listing saved notifications

## Port

`5003`

## Endpoints

- `POST /notify`
- `GET /notifications`
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
PORT=5003
RABBITMQ_URL=amqp://localhost:5672
TASK_EVENTS_EXCHANGE=task.events
TASK_EVENTS_QUEUE=notification-service.task-events
TASK_EVENTS_DEAD_LETTER_EXCHANGE=task.events.dlx
TASK_EVENTS_DEAD_LETTER_QUEUE=notification-service.task-events.dlq
MONGODB_URI=mongodb+srv://tharindulakshita2001_db_user:your_db_password@cluster0.pjnypci.mongodb.net/?appName=Cluster0
MONGODB_DB_NAME=notification_service_db
```

## Example Requests

### Store Notification

```http
POST http://localhost:5003/notify
Content-Type: application/json

{
  "message": "Task created: Finish assignment"
}
```

### Get Notifications

```http
GET http://localhost:5003/notifications
```
