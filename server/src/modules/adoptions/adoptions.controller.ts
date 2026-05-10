import { Request, Response, NextFunction } from 'express';
import { adoptionsService, AdoptionNotFoundError, AdoptionForbiddenError, AdoptionConflictError } from './adoptions.service';
import { AdoptionFiltersInput } from './adoptions.validators';

interface AuthRequest extends Request {
  user?: any;
}

function getParamId(req: AuthRequest, param = 'id'): string {
  const val = req.params[param];

  if (!val) {
    throw new Error(`Missing route param: ${param}`);
  }

  if (Array.isArray(val)) {
    if (!val[0]) {
      throw new Error(`Missing route param: ${param}`);
    }

    return val[0];
  }

  return val;
}

export const adoptionsController = {
  async createAdoption(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const adopterId = req.user!.id;
      const adoption = await adoptionsService.createAdoption(adopterId, req.body);
      res.status(201).json({ success: true, data: adoption });
    } catch (error) {
      if (error instanceof AdoptionConflictError) {
        return res.status(409).json({ success: false, message: (error as Error).message });
      }
      next(error);
    }
  },

  async getMyAdoptions(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const adopterId = req.user!.id;
      const filters = req.query as unknown as AdoptionFiltersInput;
      const result = await adoptionsService.getAdopterAdoptions(adopterId, filters);
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  },

  async getShelterAdoptions(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const shelterId = req.user!.id;
      const filters = req.query as unknown as AdoptionFiltersInput;
      const result = await adoptionsService.getShelterAdoptions(shelterId, filters);
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  },

  async getAdoptionById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const adoptionId = getParamId(req);
      const adoption = await adoptionsService.getAdoptionById(adoptionId, req.user!.id);
      res.json({ success: true, data: adoption });
    } catch (error) {
      if (error instanceof AdoptionNotFoundError) {
        return res.status(404).json({ success: false, message: (error as Error).message });
      }
      if (error instanceof AdoptionForbiddenError) {
        return res.status(403).json({ success: false, message: (error as Error).message });
      }
      next(error);
    }
  },

  async approveAdoption(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const adoptionId = getParamId(req);
      const adoption = await adoptionsService.approveAdoption(
        adoptionId,
        req.user!.id,
        req.body.notes,
      );
      res.json({ success: true, data: adoption });
    } catch (error) {
      if (error instanceof AdoptionNotFoundError) {
        return res.status(404).json({ success: false, message: (error as Error).message });
      }
      if (error instanceof AdoptionForbiddenError) {
        return res.status(403).json({ success: false, message: (error as Error).message });
      }
      next(error);
    }
  },

  async rejectAdoption(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const adoptionId = getParamId(req);
      const adoption = await adoptionsService.rejectAdoption(
        adoptionId,
        req.user!.id,
        req.body.notes,
      );
      res.json({ success: true, data: adoption });
    } catch (error) {
      if (error instanceof AdoptionNotFoundError) {
        return res.status(404).json({ success: false, message: (error as Error).message });
      }
      if (error instanceof AdoptionForbiddenError) {
        return res.status(403).json({ success: false, message: (error as Error).message });
      }
      next(error);
    }
  },
};