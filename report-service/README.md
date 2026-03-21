# Report Service

## Purpose

This service handles:

- fetching task data from the Task Service
- calculating total, completed, and pending task counts
- returning a simple summary JSON response
- saving generated summary snapshots in MongoDB

This service does not store task data itself, but it does store generated report snapshots in its own MongoDB database.

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
MONGODB_URI=mongodb+srv://tharindulakshita2001_db_user:your_db_password@cluster0.pjnypci.mongodb.net/?appName=Cluster0
MONGODB_DB_NAME=report_service_db
```

## Example Requests

### Get Summary

```http
GET http://localhost:5004/summary
```
