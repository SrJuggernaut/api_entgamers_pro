import { NextFunction, Request, Response } from 'express'
import Joi from 'joi'

import ApiError from '@services/error/ApiError'

const updateHomeSchema = Joi.object({
  seo: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required()
  }).required(),
  heroTitle: Joi.string().required(),
  heroSubtitle: Joi.string().required(),
  heroImage: Joi.string().required(),
  clanesTitle: Joi.string().required(),
  clanesDescription: Joi.string().required(),
  clanesImage: Joi.string().required(),
  clanesButtonText: Joi.string().required(),
  socialNetworksTitle: Joi.string().required(),
  socialNetworks: Joi.array().items(Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    buttons: Joi.array().items(Joi.object({
      text: Joi.string().required(),
      url: Joi.string().required()
    })).required()
  })).required(),
  teamTitle: Joi.string().required(),
  teamJoinButtonText: Joi.string().required(),
  teamViewButtonText: Joi.string().required()
})

export const validateUpdateHome = async (req: Request, res: Response, next: NextFunction) => {
  const { value, error } = updateHomeSchema.validate(req.body)
  if (error) {
    return next(new ApiError(400, error.message))
  }
  req.body = value
  next()
}
