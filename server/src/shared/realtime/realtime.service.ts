import { supabaseAdmin } from '../../config/supabase'

export const PETS_REALTIME_CHANNEL = 'pets-updates'

export type PetRealtimeEvent = 'pet:created' | 'pet:updated' | 'pet:deleted'

export interface PetRealtimePayload {
  petId?: string
  pet?: unknown
}

export class RealtimeService {
  private channel = supabaseAdmin.channel(PETS_REALTIME_CHANNEL)
  private ready = false

  async initialize(): Promise<void> {
    if (this.ready) return

    await new Promise<void>((resolve, reject) => {
      this.channel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          this.ready = true
          resolve()
        }
        if (status === 'CHANNEL_ERROR') {
          reject(new Error('No se pudo suscribir al canal de realtime'))
        }
      })
    })
  }

  async emit(event: PetRealtimeEvent, payload: PetRealtimePayload): Promise<void> {
    if (!this.ready) {
      await this.initialize()
    }

    await this.channel.send({
      type: 'broadcast',
      event,
      payload,
    })
  }
}
