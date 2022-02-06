import { NextFunction, Request, Response } from 'express'
import Joi from 'joi'

import ApiError from '@services/error/ApiError'

const updateProfileSchema = Joi.object({
  userName: Joi.string().required(),
  email: Joi.string().email().required(),
  name: Joi.string(),
  picture: Joi.string().uri(),
  biography: Joi.string(),
  gender: Joi.string(),
  dateOfBirth: Joi.string().isoDate()
})

export const validateUpdateProfile = (req: Request, res: Response, next: NextFunction) => {
  const { error, value } = updateProfileSchema.validate(req.body, { abortEarly: false })
  if (error) {
    return next(new ApiError(400, 'Bad Request', error.message))
  }
  req.body = value
  next()
}
