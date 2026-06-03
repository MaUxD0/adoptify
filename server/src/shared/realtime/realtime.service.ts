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
    
    // Nos suscribimos temporalmente para enviar el mensaje
    // En broadcast de Supabase, el emisor no necesita estar suscrito permanentemente
    // pero el canal debe estar inicializado.
    
    await channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel.send({
          type: 'broadcast',
          event,
          payload,
        })
        // Opcional: limpiar el canal después de enviar
        void supabaseAdmin.removeChannel(channel)
      }
    })
  }
}
