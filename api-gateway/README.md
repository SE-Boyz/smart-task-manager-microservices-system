# API Gateway

The API gateway exposes a single entry point for external clients and forwards requests to the appropriate downstream service.

## Routes

- `/auth/*` -> `auth-service`
- `/tasks*` -> `task-service`
- `/notifications*` -> `notification-service`
- `/reports/*` -> `report-service`
- `/audit-logs*` -> `audit-service`

## Environment Variables

```env
PORT=5000
AUTH_SERVICE_URL=http://localhost:5001
TASK_SERVICE_URL=http://localhost:5002
NOTIFICATION_SERVICE_URL=http://localhost:5003
REPORT_SERVICE_URL=http://localhost:5004
AUDIT_SERVICE_URL=http://localhost:5005
```
