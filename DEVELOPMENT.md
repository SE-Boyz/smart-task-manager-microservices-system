# Developer Setup Guide

Welcome to the Smart Task Manager project! Follow these steps to set up your local development environment.

## 📋 Prerequisites
- **Node.js** (v18 or higher)
- **Docker Desktop** (for running infrastructure)
- **Git**

## 🏗️ Step 1: Clone and Install
```powershell
# Clone the repository
git clone https://github.com/SE-Boyz/smart-task-manager-microservices-system.git
cd smart-task-manager-microservices-system

# Install root dependencies (Husky, etc.)
npm install

# Install all service dependencies (One command!)
npm run install-all
```
*(Note: I will add the 'install-all' script to package.json for you)*

## 📦 Step 2: Start Infrastructure
We use Docker Compose to run RabbitMQ and databases locally so you don't have to install them manually.
```powershell
docker-compose up -d
```

## 🔑 Step 3: Environment Variables
Each service needs a `.env` file in its own folder. You can copy the `.env.example` file in each directory:
- `JWT_SECRET`: Any long string for local testing.
- `RABBITMQ_URL`: `amqp://localhost`
- `MONGO_URI`: `mongodb://localhost:27017/taskdb`

## 🚀 Step 4: Run the System
You can start any service individually:
```powershell
cd auth-service
npm run dev
```

## ✅ Step 5: Verify
Run the quality checks to ensure everything is correct:
```powershell
npm run check-all
```
