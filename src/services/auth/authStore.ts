import prisma from '@lib/prisma'
import { Prisma } from '@prisma/client'

export const createAuth = async (authCreateArgs: Prisma.AuthCreateArgs) => {
  try {
    const auth = await prisma.auth.create({ ...authCreateArgs, include: { profile: true } })
    return auth
  } catch (error) {
    console.log(error)
  }
}

export const getAuthByIdentifier = async (authFindFirstArgs: Prisma.AuthFindFirstArgs) => {
  try {
    const auth = await prisma.auth.findFirst({ ...authFindFirstArgs, include: { profile: true } })
    return auth
  } catch (error) {
    console.log(error)
  }
}
