import { env } from './config/env'
import app from './app'
import { realtimeService } from './modules/pets/pets.routes'

const start = async () => {
  try {
    await realtimeService.initialize()
    console.log('[Realtime] Canal pets-updates listo')
  } catch (error) {
    console.warn('[Realtime] No se pudo inicializar:', error)
  }

  app.listen(Number(env.PORT), () => {
    console.log(`Server running on port ${env.PORT}`)
  })
}

start()
