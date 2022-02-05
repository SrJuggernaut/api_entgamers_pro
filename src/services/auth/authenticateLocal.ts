import ApiError from '@services/error/ApiError'
import bcrypt from 'bcrypt'
import { NextFunction, Request, Response } from 'express'

import prismaClient from '@lib/prisma'

const authenticateLocal = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body
  try {
    const auth = await prismaClient.auth.findUnique({
      where: {
        email
      },
      include: {
        profile: true
      }
    })
    if (!auth) {
      return next(new ApiError(401, 'Unauthorized', 'Invalid email or password'))
    }
    const isValid = await bcrypt.compare(password, auth.password)
    if (!isValid) {
      return next(new ApiError(401, 'Unauthorized', 'Invalid email or password'))
    }
    req.auth = auth
    next()
  } catch (error) {
    return next(error)
  }
}

export default authenticateLocal
