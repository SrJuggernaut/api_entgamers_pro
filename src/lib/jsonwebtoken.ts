import jwt, { JsonWebTokenError } from 'jsonwebtoken'
import type { Auth } from '@prisma/client'

import { JWT_SECRET } from '@lib/dotenv'

export const createBearerToken = (auth: Auth, trusted:boolean): string => {
  return jwt.sign({ sub: auth.id }, JWT_SECRET, { expiresIn: trusted ? '30d' : '7h' })
}

export const verifyBearerToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET) as { sub: Auth['id'] }
}

export const createVerifyEmailToken = (auth: Auth) => {
  return jwt.sign({ sub: auth.id, service: 'VERIFY_EMAIL' }, JWT_SECRET)
}

export const verifyVerifyEmailToken = (token: string) => {
  const payload = jwt.verify(token, JWT_SECRET) as { sub: Auth['id'], service: string }
  if (payload.service !== 'VERIFY_EMAIL') {
    throw new JsonWebTokenError('Invalid token')
  }
  return payload
}

export const createRecoverPasswordToken = (auth: Auth) => {
  return jwt.sign({ sub: auth.id, service: 'RECOVER_PASSWORD' }, JWT_SECRET, {
    expiresIn: '2h'
  })
}

export const verifyRecoverPasswordToken = (token: string) => {
  const payload = jwt.verify(token, JWT_SECRET) as { sub: Auth['id'], service: string }
  if (payload.service !== 'RECOVER_PASSWORD') {
    throw new JsonWebTokenError('Invalid token')
  }
  return payload
}

export const createChangeEmailToken = (auth: Auth, newEmail: string) => {
  return jwt.sign({ sub: auth.id, newEmail, service: 'CHANGE_EMAIL' }, JWT_SECRET, {
    expiresIn: '2h'
  })
}

export const verifyChangeEmailToken = (token: string) => {
  const payload = jwt.verify(token, JWT_SECRET) as { sub: Auth['id'], newEmail: string, service: string }
  if (payload.service !== 'CHANGE_EMAIL') {
    throw new JsonWebTokenError('Invalid token')
  }
  return payload
}
