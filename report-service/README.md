# Report Service

## Purpose

This service handles:

- consuming task lifecycle events from RabbitMQ
- maintaining a local task projection in MongoDB
- calculating total, completed, and pending task counts from that projection
- returning a simple summary JSON response
- exposing health information for both MongoDB and RabbitMQ

This service does not call the Task Service for report reads. It keeps a local read model in its own database so reporting stays event-driven and database boundaries stay intact.

## Port

`5004`

## Endpoints

- `GET /summary`
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
PORT=5004
RABBITMQ_URL=amqp://localhost:5672
TASK_EVENTS_EXCHANGE=task.events
TASK_EVENTS_QUEUE=report-service.task-events
TASK_EVENTS_DEAD_LETTER_EXCHANGE=task.events.dlx
TASK_EVENTS_DEAD_LETTER_QUEUE=report-service.task-events.dlq
MONGODB_URI=mongodb+srv://tharindulakshita2001_db_user:your_db_password@cluster0.pjnypci.mongodb.net/?appName=Cluster0
MONGODB_DB_NAME=report_service_db
```

## Example Requests

### Get Summary

```http
GET http://localhost:5004/summary
```

The summary is eventually consistent because it is derived from asynchronously consumed task events.
