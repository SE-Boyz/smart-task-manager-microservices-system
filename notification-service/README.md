# Notification Service

## Purpose

This service handles:

- receiving notifications from the Task Service
- storing notification logs in a JSON file
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
