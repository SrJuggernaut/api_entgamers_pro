import { NextFunction, Request, Response } from 'express'

import { verifyAuthToken } from '@lib/jsonwebtoken'
import prismaClient from '@lib/prisma'
import ApiError from '@services/error/ApiError'

export const authenticateNotRequiredJwt = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) {
    return next()
  } else {
    const payload = verifyAuthToken(token)
    if (payload.sub && typeof payload.sub === 'string') {
      const auth = await prismaClient.auth.findUnique({
        where: {
          id: payload.sub
        },
        include: {
          profile: true
        }
      })
      if (auth) {
        req.auth = auth
        return next()
      } else {
        return new ApiError(401, 'Unauthorized', 'Invalid token')
      }
    }
  }
}

const authenticateJwt = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) {
    return next(new ApiError(401, 'Unauthorized', 'No token provided'))
  }
  try {
    const payload = verifyAuthToken(token)
    if (payload.sub && typeof payload.sub === 'string') {
      const auth = await prismaClient.auth.findUnique({
        where: {
          id: payload.sub
        },
        include: {
          profile: true
        }
      })
      if (auth) {
        req.auth = auth
        next()
      } else {
        return new ApiError(401, 'Unauthorized', 'Invalid token')
      }
    }
  } catch (error) {
    return new ApiError(401, 'Unauthorized', 'Invalid token')
  }
}

export default authenticateJwt
