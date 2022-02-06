import ApiError from '@services/error/ApiError'
import { NextFunction, Request, Response } from 'express'
import Joi from 'joi'

const discordSchema = Joi.object({
  code: Joi.string().required()
})

export const validateDiscord = (req: Request, res: Response, next: NextFunction) => {
  const { error, value } = discordSchema.validate(req.body, { abortEarly: false })
  if (error) {
    return next(new ApiError(400, 'Bad Request', error.details[0].message))
  }
  req.query.code = value.code
  next()
}
