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
    // Small delay to ensure clients have time to subscribe to the channel
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const channel = supabaseAdmin.channel(channelName)
    
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error(`Timeout subscribing to channel ${channelName}`))
      }, 5000)
      
      channel.subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          try {
            clearTimeout(timeout)
            await channel.send({
              type: 'broadcast',
              event,
              payload,
            })
            void supabaseAdmin.removeChannel(channel)
            resolve()
          } catch (err) {
            clearTimeout(timeout)
            reject(err)
          }
        }
        if (status === 'CHANNEL_ERROR') {
          clearTimeout(timeout)
          reject(new Error(`Error subscribing to channel ${channelName}`))
        }
      })
    })
  }
}

