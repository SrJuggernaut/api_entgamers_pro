import { NextFunction, Request, Response } from 'express'
import Joi from 'joi'

import ApiError from '@services/error/ApiError'

const profileIdSchema = Joi.string().label('id').uuid().required()

export const validateProfileIdParam = (req: Request, res: Response, next: NextFunction) => {
  const { error, value } = profileIdSchema.validate(req.params.id)
  if (error) {
    return next(new ApiError(400, 'Bad Request', error.message))
  }
  req.params.id = value
  next()
}
