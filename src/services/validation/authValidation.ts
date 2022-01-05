import { NextFunction, Request, Response } from 'express'
import Joi from 'joi'

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().required()
})

export const validateRegister = (req: Request, res: Response, next: NextFunction) => {
  const { error } = registerSchema.validate(req.body)
  if (error) {
    return res.status(400).json({
      message: error.details[0].message
    })
  }
  next()
}

const authDiscordSchema = Joi.object({
  code: Joi.string().required()
})

export const validateAuthDiscord = (req: Request, res: Response, next: NextFunction) => {
  // console.log('params', req.params)
  const { error, value } = authDiscordSchema.validate(req.body)
  if (error) {
    return res.status(400).json({
      message: error.details[0].message
    })
  }
  req.query.code = value.code
  next()
}

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
})

export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const { error } = loginSchema.validate(req.body)
  if (error) {
    return res.status(400).json({
      message: error.details[0].message
    })
  }
  next()
}
