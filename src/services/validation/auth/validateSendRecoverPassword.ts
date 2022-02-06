import { NextFunction, Request, Response } from 'express'
import Joi from 'joi'

import ApiError from '@services/error/ApiError'

const sendRecoverPasswordSchema = Joi.object({
  email: Joi.string().email().required()
})

export const validateSendRecoverPassword = (req: Request, res: Response, next: NextFunction) => {
  const { error, value } = sendRecoverPasswordSchema.validate(req.body, { abortEarly: false })
  if (error) {
    return next(new ApiError(400, 'Bad Request', error.details[0].message))
  }
  req.body = value
  next()
}
