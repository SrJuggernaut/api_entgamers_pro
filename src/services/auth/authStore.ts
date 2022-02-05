import prisma from '@lib/prisma'
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

export const getAuthByIdentifier = async (authFindUniqueArgs: Prisma.AuthFindUniqueArgs) => {
  try {
    const auth = await prisma.auth.findUnique({ ...authFindUniqueArgs, include: { profile: true } })
    return auth
  } catch (error) {
    throw prismaErrorCatcher(error)
  }
}

export const getAuthByProvider = async (providerFindUniqueArgs: Prisma.ProviderFindUniqueArgs) => {
  try {
    const provider = await prisma.provider.findUnique({ ...providerFindUniqueArgs, include: { auth: { include: { providers: true, profile: true } } } })
    return provider?.auth
  } catch (error) {
    throw prismaErrorCatcher(error)
  }
}

export const getAuthByProfile = async (profileFindUniqueArgs: Prisma.ProfileFindUniqueArgs) => {
  try {
    const profile = await prisma.profile.findUnique({ ...profileFindUniqueArgs, include: { auth: { include: { providers: true, profile: true } } } })
    return profile?.auth
  } catch (error) {
    throw prismaErrorCatcher(error)
  }
}

export const getAuthByEmail = async (email: Prisma.AuthFindUniqueArgs['where']['email']) => {
  try {
    const auth = await prisma.auth.findUnique({ where: { email }, include: { profile: true } })
    return auth
  } catch (error) {
    throw prismaErrorCatcher(error)
  }
}

export const updateAuth = async (authUpdateArgs: Prisma.AuthUpdateArgs) => {
  try {
    const auth = await prisma.auth.update({ ...authUpdateArgs, include: { profile: true } })
    return auth
  } catch (error) {
    throw prismaErrorCatcher(error)
  }
}
