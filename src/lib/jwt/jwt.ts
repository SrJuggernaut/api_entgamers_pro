import jwt from 'jsonwebtoken'
import type { Auth } from '@prisma/client'

import { JWT_SECRET } from '@lib/dotenv/dotenv'

export const createAuthToken = (auth: Auth) => {
  return jwt.sign({ sub: auth.id }, JWT_SECRET, {
    expiresIn: '1h'
  })
}

export const verifyAuthToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET)
}

export const createVerifyToken = (auth: Auth) => {
  return jwt.sign({ sub: auth.id }, JWT_SECRET)
}

export const verifyVerifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET)
}
