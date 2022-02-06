import { NextFunction, Request, Response } from 'express'

import { verifyBearerToken } from '@lib/jsonwebtoken'
import { getAuthByIdentifier } from '@services/auth/authStore'
import ApiError from '@services/error/ApiError'

export const notRequiredAuthenticateJwt = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) {
    return next()
  } else {
    const payload = verifyBearerToken(token)
    if (payload.sub && typeof payload.sub === 'string') {
      const auth = await getAuthByIdentifier({
        where: {
          id: payload.sub
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
    const payload = verifyBearerToken(token)
    if (payload.sub && typeof payload.sub === 'string') {
      const auth = await getAuthByIdentifier({
        where: {
          id: payload.sub
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
