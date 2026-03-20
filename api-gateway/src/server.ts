import 'dotenv/config'
import app from './app.js'
import { getEnv } from './config/env.js'

const { port } = getEnv()

app.listen(port, () => {
  console.log(`API Gateway running on http://localhost:${port}`)
})
