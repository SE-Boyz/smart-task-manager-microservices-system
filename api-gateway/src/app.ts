import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import gatewayRouter from './routes/gatewayRoutes.js'

const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json())

app.get('/health', (_req, res) => {
  res.status(200).json({
    service: 'api-gateway',
    status: 'ok',
  })
})

app.use('/', gatewayRouter)

export default app
