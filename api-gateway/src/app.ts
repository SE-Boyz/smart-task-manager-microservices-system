import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import gatewayRouter from './routes/gatewayRoutes.js'

const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json())

app.use((req, res, next) => {
  console.log(`[Gateway] ${req.method} ${req.path}`)
  next()
})

app.get('/health', (_req, res) => {
  res.status(200).json({
    service: 'api-gateway',
    status: 'ok',
  })
})

app.use('/', gatewayRouter)

export default app
