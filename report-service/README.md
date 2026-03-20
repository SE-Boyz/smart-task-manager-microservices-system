# Report Service

## Purpose

This service handles:

- fetching task data from the Task Service
- calculating total, completed, and pending task counts
- returning a simple summary JSON response

This service does not store task data itself.

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
TASK_SERVICE_URL=http://localhost:5002
JWT_SECRET=your_jwt_secret
```

## Example Requests

### Get Summary

```http
GET http://localhost:5004/summary
```
