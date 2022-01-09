import jwt from 'jsonwebtoken'
import type { Auth } from '@prisma/client'

import { JWT_SECRET } from '@lib/dotenv/dotenv'

export const createAuthToken = (user: Auth) => {
  return jwt.sign({ sub: user.id }, JWT_SECRET, {
    expiresIn: '1h'
  })
}

export const verifyAuthToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET)
}
