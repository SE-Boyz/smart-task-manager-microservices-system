# Audit Service

## Purpose

This service handles:

- consuming user lifecycle events from RabbitMQ
- storing registration and login audit logs in MongoDB
- returning authenticated users their own audit history
- exposing a small audit summary for evaluation demos

## Port

`5005`

## Endpoints

- `GET /audit-logs`
- `GET /audit-logs/summary`
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
PORT=5005
JWT_PUBLIC_KEY=-----BEGIN PUBLIC KEY-----\nreplace_with_your_rs256_public_key\n-----END PUBLIC KEY-----
RABBITMQ_URL=amqp://localhost:5672
USER_EVENTS_EXCHANGE=user.events
USER_EVENTS_QUEUE=audit-service.user-events
USER_EVENTS_DEAD_LETTER_EXCHANGE=user.events.dlx
USER_EVENTS_DEAD_LETTER_QUEUE=audit-service.user-events.dlq
MONGODB_URI=mongodb+srv://tharindulakshita2001_db_user:your_db_password@cluster0.pjnypci.mongodb.net/?appName=Cluster0
MONGODB_DB_NAME=audit_service_db
```

## Example Requests

### Get Audit Logs

```http
GET http://localhost:5005/audit-logs
Authorization: Bearer YOUR_TOKEN
```

### Get Audit Summary

```http
GET http://localhost:5005/audit-logs/summary
Authorization: Bearer YOUR_TOKEN
```
