import ApiError from '@services/error/ApiError'
import { NextFunction, Request, Response } from 'express'
import Joi from 'joi'

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
