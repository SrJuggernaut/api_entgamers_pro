import { NextFunction, Request, Response } from 'express'
import Joi from 'joi'

import ApiError from '@services/error/ApiError'

const changePasswordSchema = Joi.object({
  password: Joi.string().min(6).required()
})

export const validateChangePassword = (req: Request, res: Response, next: NextFunction) => {
  const { error, value } = changePasswordSchema.validate(req.body, { abortEarly: false })
  if (error) {
    return next(new ApiError(400, 'Bad Request', error.details[0].message))
  }
  req.body = value
  next()
}
