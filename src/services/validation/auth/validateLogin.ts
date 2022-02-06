import ApiError from '@services/error/ApiError'
import { NextFunction, Request, Response } from 'express'
import Joi from 'joi'

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  trusted: Joi.boolean().required()
})

export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const { error, value } = loginSchema.validate(req.body, { abortEarly: false })
  if (error) {
    return next(new ApiError(400, 'Bad Request', error.details[0].message))
  }
  req.body = value
  next()
}
