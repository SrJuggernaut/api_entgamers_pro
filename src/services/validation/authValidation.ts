import ApiError from '@services/error/ApiError'
import { NextFunction, Request, Response } from 'express'
import Joi from 'joi'

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  userName: Joi.string().required()
})

export const validateRegister = (req: Request, res: Response, next: NextFunction) => {
  const { error, value } = registerSchema.validate(req.body, { abortEarly: false })
  if (error) {
    return next(new ApiError(400, 'Bad Request', error.details[0].message))
  }
  req.body = value
  next()
}

const authDiscordSchema = Joi.object({
  code: Joi.string().required()
})

export const validateAuthDiscord = (req: Request, res: Response, next: NextFunction) => {
  const { error, value } = authDiscordSchema.validate(req.body, { abortEarly: false })
  if (error) {
    return next(new ApiError(400, 'Bad Request', error.details[0].message))
  }
  req.query.code = value.code
  next()
}

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

const verifySchema = Joi.object({
  token: Joi.string().required()
})

export const validateVerify = (req: Request, res: Response, next: NextFunction) => {
  const { error, value } = verifySchema.validate(req.body, { abortEarly: false })
  if (error) {
    return next(new ApiError(400, 'Bad Request', error.details[0].message))
  }
  req.body = value
  next()
}

const sendEmailSchema = Joi.object({
  email: Joi.string().email().required()
})

export const validateSendEmail = (req: Request, res: Response, next: NextFunction) => {
  const { error, value } = sendEmailSchema.validate(req.body, { abortEarly: false })
  if (error) {
    return next(new ApiError(400, 'Bad Request', error.details[0].message))
  }
  req.body = value
  next()
}

const recoverPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  token: Joi.string().required()
})

export const validateRecoverPassword = (req: Request, res: Response, next: NextFunction) => {
  const { error, value } = recoverPasswordSchema.validate(req.body, { abortEarly: false })
  if (error) {
    return next(new ApiError(400, 'Bad Request', error.details[0].message))
  }
  req.body = value
  next()
}

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

const changeEmailSchema = Joi.object({
  email: Joi.string().email().required()
})

export const validateChangeEmail = (req: Request, res: Response, next: NextFunction) => {
  const { error, value } = changeEmailSchema.validate(req.body, { abortEarly: false })
  if (error) {
    return next(new ApiError(400, 'Bad Request', error.details[0].message))
  }
  req.body = value
  next()
}
