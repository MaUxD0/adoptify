import type { Request, Response, NextFunction } from 'express'
import type { ZodTypeAny } from 'zod'
import { ZodError } from 'zod'

interface ValidateSchemas {
  body?: ZodTypeAny
  params?: ZodTypeAny
  query?: ZodTypeAny
}

export function validate(schemas: ValidateSchemas) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (schemas.body) {
        req.body = schemas.body.parse(req.body)
      }
      if (schemas.params) {
        req.params = schemas.params.parse(req.params) as typeof req.params
      }
      if (schemas.query) {
        Object.assign(req.query, schemas.query.parse(req.query))
      }
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(422).json({
          success: false,
          message: 'Validation error',
          errors: error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        })
        return
      }
      next(error)
    }
  }
}
