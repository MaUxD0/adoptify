import type { Response } from 'express'
import type { AuthRequest } from '../../middlewares/auth.middleware'
import type { PetsService } from './pets.service'
import type { ListPetsFilters } from './pets.types'

export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  list = async (req: AuthRequest, res: Response): Promise<void> => {
    const filters = req.query as unknown as ListPetsFilters
    const pets = await this.petsService.list(filters)

    res.status(200).json({
      success: true,
      data: pets,
    })
  }

  getById = async (req: AuthRequest, res: Response): Promise<void> => {
    const id = String(req.params.id)
    const pet = await this.petsService.getById(id)

    res.status(200).json({
      success: true,
      data: pet,
    })
  }

  create = async (req: AuthRequest, res: Response): Promise<void> => {
    const shelterId = req.user!.id
    const pet = await this.petsService.create(shelterId, req.body)

    res.status(201).json({
      success: true,
      data: pet,
    })
  }

  update = async (req: AuthRequest, res: Response): Promise<void> => {
    const id = String(req.params.id)
    const pet = await this.petsService.update(id, req.user!.id, req.body)

    res.status(200).json({
      success: true,
      data: pet,
    })
  }

  remove = async (req: AuthRequest, res: Response): Promise<void> => {
    const id = String(req.params.id)
    await this.petsService.remove(id, req.user!.id)

    res.status(200).json({
      success: true,
      message: 'Mascota eliminada',
    })
  }
}
