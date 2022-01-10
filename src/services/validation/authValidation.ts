import ApiError from '@services/error/ApiError'
import { NextFunction, Request, Response } from 'express'
import Joi from 'joi'

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  userName: Joi.string().required()
})

export const validateRegister = (req: Request, res: Response, next: NextFunction) => {
  const { error } = registerSchema.validate(req.body, { abortEarly: false })
  if (error) {
    next(new ApiError(400, 'Bad Request', error.details[0].message))
  }
  next()
}

const authDiscordSchema = Joi.object({
  code: Joi.string().required()
})

export const validateAuthDiscord = (req: Request, res: Response, next: NextFunction) => {
  const { error, value } = authDiscordSchema.validate(req.body, { abortEarly: false })
  if (error) {
    next(new ApiError(400, 'Bad Request', error.details[0].message))
  }
  req.query.code = value.code
  next()
}

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
})

export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const { error } = loginSchema.validate(req.body, { abortEarly: false })
  if (error) {
    next(new ApiError(400, 'Bad Request', error.details[0].message))
  }
  next()
}
