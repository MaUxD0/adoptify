import { CreateAdoptionDto, AdoptionFilters, AdoptionStatuses, PaginatedResult } from './adoptions.types';

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const adoptionSelect = {
  id: true,
  petId: true,
  adopterId: true,
  shelterId: true,
  status: true,
  message: true,
  notes: true,
  createdAt: true,
  updatedAt: true,
  pet: {
    select: {
      id: true,
      name: true,
      species: true,
      breed: true,
      imageUrl: true,
    },
  },
  adopter: {
    select: { id: true, name: true, email: true },
  },
  shelter: {
    select: { id: true, name: true, email: true },
  },
} as const;

export const adoptionsRepository = {
  async create(data: CreateAdoptionDto & { adopterId: string }): Promise<{ id: string; [key: string]: unknown }> {
    return prisma.adoption.create({
      data: {
        petId: data.petId,
        adopterId: data.adopterId,
        shelterId: data.shelterId,
        message: data.message,
        status: AdoptionStatuses.PENDING,
      },
      include: {
        pet: { select: { id: true, name: true, species: true, breed: true, imageUrl: true } },
        adopter: { select: { id: true, name: true, email: true } },
        shelter: { select: { id: true, name: true, email: true } },
      },
    });
  },

  async findById(id: string) {
    return prisma.adoption.findUnique({
      where: { id },
      select: adoptionSelect,
    });
  },

  async findByAdopter(
    adopterId: string,
    filters: AdoptionFilters,
  ): Promise<PaginatedResult<(typeof adoptionSelect extends { [K: string]: unknown } ? unknown : never)>> {
    const { status, page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;
    const where = { adopterId, ...(status && { status }) };

    const [data, total] = await Promise.all([
      prisma.adoption.findMany({
        where,
        select: adoptionSelect,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.adoption.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  async findByShelter(
    shelterId: string,
    filters: AdoptionFilters,
  ): Promise<PaginatedResult<unknown>> {
    const { status, page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;
    const where = { shelterId, ...(status && { status }) };

    const [data, total] = await Promise.all([
      prisma.adoption.findMany({
        where,
        select: adoptionSelect,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.adoption.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  async updateStatus(
    id: string,
    status: typeof AdoptionStatuses.APPROVED | typeof AdoptionStatuses.REJECTED,
    notes?: string,
  ) {
    return prisma.adoption.update({
      where: { id },
      data: { status, notes },
      select: adoptionSelect,
    });
  },

  async existsByPetAndAdopter(petId: string, adopterId: string): Promise<boolean> {
    const count = await prisma.adoption.count({
      where: { petId, adopterId, status: { not: AdoptionStatuses.CANCELLED } },
    });
    return count > 0;
  },
};
