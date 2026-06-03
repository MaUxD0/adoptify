import { adoptionsRepository } from "./adoptions.repository";
import { chatRepository } from "../chat/chat.repository";
import { AdoptionStatuses } from "./adoptions.types";
import { RealtimeService } from "../../shared/realtime/realtime.service";

const realtime = new RealtimeService();
const ADOPTIONS_CHANNEL = 'adoption_requests_realtime';

// ─────────────────────────────
// ERRORS
// ─────────────────────────────
export class AdoptionNotFoundError extends Error {
  constructor(id: string) {
    super(`Adoption ${id} not found`);
    this.name = "AdoptionNotFoundError";
  }
}

export class AdoptionForbiddenError extends Error {
  constructor(message = "Forbidden") {
    super(message);
    this.name = "AdoptionForbiddenError";
  }
}

export class AdoptionConflictError extends Error {
  constructor() {
    super("An active adoption request already exists for this pet");
    this.name = "AdoptionConflictError";
  }
}

// ─────────────────────────────
// SERVICE
// ─────────────────────────────
export const adoptionsService = {
  // ─────────────────────────────
  // CREATE ADOPTION + AUTO CHAT
  // ─────────────────────────────
  async createAdoption(adopterId: string, dto: any) {
    const { petId } = dto;

    if (!petId) {
      throw new Error("petId is required");
    }

    // 1. evitar duplicados
    const exists = await adoptionsRepository.existsByPetAndAdopter(
      petId,
      adopterId
    );

    if (exists) throw new AdoptionConflictError();

    // 2. crear adopción
    const adoption = await adoptionsRepository.create({
      ...dto,
      adopterId,
    });

    // Broadcast creation
    await realtime.emit('adoption:created', { adoption }, ADOPTIONS_CHANNEL);

    // 3. crear chat automático (SAFE)
    try {
      const petIdResolved = adoption?.pet_id || petId;

      // traer pet completo desde backend repository
      const adoptionFull = await adoptionsRepository.findById(adoption.id);

      const shelterId = (adoptionFull as any)?.pets?.shelter_id;

      if (shelterId) {
        await chatRepository.findOrCreateConversation(
          adopterId,
          shelterId,
          petIdResolved
        );
      }
    } catch (err) {
      console.error("Auto-chat creation failed:", err);
      // no rompemos adopción si chat falla
    }

    return adoption;
  },

  // ─────────────────────────────
  // ADOPTER LIST
  // ─────────────────────────────
  async getAdopterAdoptions(adopterId: string, filters: any) {
    return adoptionsRepository.findByAdopter(adopterId, filters);
  },

  // ─────────────────────────────
  // SHELTER LIST
  // ─────────────────────────────
  async getShelterAdoptions(shelterId: string, filters: any) {
    return adoptionsRepository.findByShelter(shelterId, filters);
  },

  // ─────────────────────────────
  // APPROVE
  // ─────────────────────────────
  async approveAdoption(adoptionId: string, shelterId: string, notes?: string) {
    const adoption = await adoptionsRepository.findById(adoptionId);

    if (!adoption) throw new AdoptionNotFoundError(adoptionId);

    const a = adoption as any;

    if (a?.pets?.shelter_id !== shelterId) {
      throw new AdoptionForbiddenError(
        "You do not manage this adoption request"
      );
    }

    const updated = await adoptionsRepository.updateStatus(
      adoptionId,
      AdoptionStatuses.APPROVED,
      notes
    );

    // Broadcast update
    await realtime.emit('adoption:updated', { adoption: updated }, ADOPTIONS_CHANNEL);

    return updated;
  },

  // ─────────────────────────────
  // REJECT
  // ─────────────────────────────
  async rejectAdoption(adoptionId: string, shelterId: string, notes?: string) {
    const adoption = await adoptionsRepository.findById(adoptionId);

    if (!adoption) throw new AdoptionNotFoundError(adoptionId);

    const a = adoption as any;

    if (a?.pets?.shelter_id !== shelterId) {
      throw new AdoptionForbiddenError(
        "You do not manage this adoption request"
      );
    }

    const updated = await adoptionsRepository.updateStatus(
      adoptionId,
      AdoptionStatuses.REJECTED,
      notes
    );

    // Broadcast update
    await realtime.emit('adoption:updated', { adoption: updated }, ADOPTIONS_CHANNEL);

    return updated;
  },

  // ─────────────────────────────
  // GET BY ID (SECURITY)
  // ─────────────────────────────
  async getAdoptionById(adoptionId: string, requesterId: string) {
    const adoption = await adoptionsRepository.findById(adoptionId);

    if (!adoption) throw new AdoptionNotFoundError(adoptionId);

    const a = adoption as any;

    const isOwner =
      a.adopter_id === requesterId ||
      a?.pets?.shelter_id === requesterId;

    if (!isOwner) {
      throw new AdoptionForbiddenError();
    }

    return adoption;
  },
};