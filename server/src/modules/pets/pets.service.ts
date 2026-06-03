import { AppError } from '../../middlewares/error.middleware'
import {
  RealtimeService,
} from '../../shared/realtime/realtime.service'
import { PetsRepository } from './pets.repository'
import type {
  CreatePetDTO,
  ListPetsFilters,
  Pet,
  UpdatePetDTO,
} from './pets.types'

export class PetsService {
  constructor(
    private readonly repository: PetsRepository,
    private readonly realtime: RealtimeService,
  ) {}

  async list(filters: ListPetsFilters): Promise<Pet[]> {
    return this.repository.findAll(filters)
  }

  async getById(id: string): Promise<Pet> {
    try {
      return await this.repository.findById(id)
    } catch {
      throw new AppError('Mascota no encontrada', 404)
    }
  }

  async create(shelterId: string, payload: CreatePetDTO): Promise<Pet> {
    const pet = await this.repository.create(shelterId, payload)
    await this.broadcast('pet:created', { pet, petId: pet.id })
    return pet
  }

  async update(
    petId: string,
    shelterId: string,
    payload: UpdatePetDTO,
  ): Promise<Pet> {
    const ownsPet = await this.repository.belongsToShelter(petId, shelterId)

    if (!ownsPet) {
      throw new AppError('No tienes permiso para editar esta mascota', 403)
    }

    const pet = await this.repository.update(petId, payload)
    await this.broadcast('pet:updated', { pet, petId: pet.id })
    return pet
  }

  async remove(petId: string, shelterId: string): Promise<void> {
    const ownsPet = await this.repository.belongsToShelter(petId, shelterId)

    if (!ownsPet) {
      throw new AppError('No tienes permiso para eliminar esta mascota', 403)
    }

    await this.repository.delete(petId)
    await this.broadcast('pet:deleted', { petId })
  }

  private async broadcast(
    event: string,
    payload: { pet?: Pet; petId?: string },
  ): Promise<void> {
    await this.realtime.emit(event, payload, 'pets-updates')
  }
}
