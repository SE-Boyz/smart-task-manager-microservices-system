import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import swaggerUi from 'swagger-ui-express'
import swaggerSpec from './config/swagger.js'
import { getDatabaseStatus } from './config/database.js'
import errorHandler from './middleware/errorHandler.js'
import authRoutes from './routes/authRoutes.js'

const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json())

app.get('/', (_req, res) => {
  res.status(200).json({ message: 'Auth Service is running' })
})

app.get('/health', (_req, res) => {
  res.status(200).json({
    service: 'auth-service',
    status: 'ok',
    database: getDatabaseStatus(),
  })
})

app.use('/', authRoutes)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use(errorHandler)

export default app
