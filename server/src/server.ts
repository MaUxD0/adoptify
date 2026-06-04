import { env } from './config/env'
import app from './app'

const start = async () => {
  try {
    console.log('[Server] Starting on port', env.PORT)
  } catch (error) {
    console.warn('[Server] Error:', error)
  }

  app.listen(Number(env.PORT), () => {
    console.log(`Server running on port ${env.PORT}`)
  })
}

start()
