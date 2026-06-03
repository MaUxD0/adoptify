import { supabaseAdmin } from '../../config/supabase'

export const DEFAULT_REALTIME_CHANNEL = 'app-updates'

export class RealtimeService {
  /**
   * Emite un evento de broadcast a través de Supabase
   * @param event Nombre del evento (e.g., 'pet:created', 'adoption:updated')
   * @param payload Datos a enviar
   * @param channelName Nombre del canal (por defecto app-updates)
   */
  async emit(event: string, payload: any, channelName: string = DEFAULT_REALTIME_CHANNEL): Promise<void> {
    const channel = supabaseAdmin.channel(channelName)
    
    return new Promise((resolve, reject) => {
      channel.subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          try {
            await channel.send({
              type: 'broadcast',
              event,
              payload,
            })
            void supabaseAdmin.removeChannel(channel)
            resolve()
          } catch (err) {
            reject(err)
          }
        }
        if (status === 'CHANNEL_ERROR') {
          reject(new Error(`Error subscribing to channel ${channelName}`))
        }
      })
    })
  }
}
