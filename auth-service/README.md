# Auth Service

## Purpose

This service handles:

- user registration
- user login
- password hashing with `bcrypt`
- JWT token generation
- protected profile access

## Port

`5001`

## Endpoints

- `POST /register`
- `POST /login`
- `GET /profile`
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
PORT=5001
JWT_SECRET=your_jwt_secret
```

## Example Requests

### Register

```http
POST http://localhost:5001/register
Content-Type: application/json

{
  "name": "John",
  "email": "john@example.com",
  "password": "123456"
}
```

### Login

```http
POST http://localhost:5001/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "123456"
}
```

### Get Profile

```http
GET http://localhost:5001/profile
Authorization: Bearer YOUR_TOKEN
```
