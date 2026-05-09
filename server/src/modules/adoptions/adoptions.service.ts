import { adoptionsRepository } from './adoptions.repository';
import { CreateAdoptionDto, AdoptionFilters, AdoptionStatuses } from './adoptions.types';

export class AdoptionNotFoundError extends Error {
  constructor(id: string) {
    super(`Adoption ${id} not found`);
    this.name = 'AdoptionNotFoundError';
  }
}

export class AdoptionForbiddenError extends Error {
  constructor(message = 'Forbidden') {
    super(message);
    this.name = 'AdoptionForbiddenError';
  }
}

export class AdoptionConflictError extends Error {
  constructor() {
    super('An active adoption request already exists for this pet');
    this.name = 'AdoptionConflictError';
  }
}

export const adoptionsService = {
  async createAdoption(adopterId: string, dto: CreateAdoptionDto) {
    const alreadyExists = await adoptionsRepository.existsByPetAndAdopter(dto.petId, adopterId);
    if (alreadyExists) throw new AdoptionConflictError();

    const adoption = await adoptionsRepository.create({ ...dto, adopterId });


    return adoption;
  },

  async getAdopterAdoptions(adopterId: string, filters: AdoptionFilters) {
    return adoptionsRepository.findByAdopter(adopterId, filters);
  },

  async getShelterAdoptions(shelterId: string, filters: AdoptionFilters) {
    return adoptionsRepository.findByShelter(shelterId, filters);
  },

  async approveAdoption(adoptionId: string, shelterId: string, notes?: string) {
    const adoption = await adoptionsRepository.findById(adoptionId);
    if (!adoption) throw new AdoptionNotFoundError(adoptionId);
    if ((adoption as { shelterId: string }).shelterId !== shelterId) {
      throw new AdoptionForbiddenError('You do not manage this adoption request');
    }

    return adoptionsRepository.updateStatus(adoptionId, AdoptionStatuses.APPROVED, notes);
  },

  async rejectAdoption(adoptionId: string, shelterId: string, notes?: string) {
    const adoption = await adoptionsRepository.findById(adoptionId);
    if (!adoption) throw new AdoptionNotFoundError(adoptionId);
    if ((adoption as { shelterId: string }).shelterId !== shelterId) {
      throw new AdoptionForbiddenError('You do not manage this adoption request');
    }

    return adoptionsRepository.updateStatus(adoptionId, AdoptionStatuses.REJECTED, notes);
  },

  async getAdoptionById(adoptionId: string, requesterId: string) {
    const adoption = await adoptionsRepository.findById(adoptionId);
    if (!adoption) throw new AdoptionNotFoundError(adoptionId);

    const a = adoption as { adopterId: string; shelterId: string };
    if (a.adopterId !== requesterId && a.shelterId !== requesterId) {
      throw new AdoptionForbiddenError();
    }

    return adoption;
  },
};
