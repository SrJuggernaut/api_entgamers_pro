import { NextFunction, Request, Response } from 'express'
import Joi from 'joi'

import ApiError from '@services/error/ApiError'

const updateProfileRoleSchema = Joi.object({
  role: Joi.string().required()
})

export const validateUpdateProfileRole = (req: Request, res: Response, next: NextFunction) => {
  const { error, value } = updateProfileRoleSchema.validate(req.body, { abortEarly: false })
  if (error) {
    return next(new ApiError(400, 'Bad Request', error.message))
  }
  req.body = value
  next()
}
