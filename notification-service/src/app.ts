import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import swaggerUi from 'swagger-ui-express'
import { getBrokerStatus } from './config/broker.js'
import swaggerSpec from './config/swagger.js'
import { getDatabaseStatus } from './config/database.js'
import errorHandler from './middleware/errorHandler.js'
import notificationRoutes from './routes/notificationRoutes.js'

const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json())

app.get('/health', (_req, res) => {
  res.status(200).json({
    service: 'notification-service',
    status: 'ok',
    database: getDatabaseStatus(),
    broker: getBrokerStatus(),
  })
})

app.use('/', notificationRoutes)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use(errorHandler)

export default app
