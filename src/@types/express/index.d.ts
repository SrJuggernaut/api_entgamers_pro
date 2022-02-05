import { Prisma } from '@prisma/client'

const authWithProfile = Prisma.validator<Prisma.AuthArgs>()({
  include: {
    profile: true
  }
})

type AuthWithProfile = Prisma.AuthGetPayload<typeof authWithProfile>

declare module 'express-serve-static-core' {
  interface Request {
    auth: AuthWithProfile
  }
}
