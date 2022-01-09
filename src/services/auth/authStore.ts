import prisma from '@lib/prisma/prisma'
import { Prisma } from '@prisma/client'

import prismaErrorCatcher from '@services/error/prismaErrorCatcher'

export const createAuth = async (authCreateArgs: Prisma.AuthCreateArgs) => {
  try {
    const auth = await prisma.auth.create({ ...authCreateArgs, include: { profile: true } })
    return auth
  } catch (error) {
    throw prismaErrorCatcher(error)
  }
}

export const getAuthByIdentifier = async (authFindFirstArgs: Prisma.AuthFindFirstArgs) => {
  try {
    const auth = await prisma.auth.findFirst({ ...authFindFirstArgs, include: { profile: true } })
    return auth
  } catch (error) {
    throw prismaErrorCatcher(error)
  }
}
