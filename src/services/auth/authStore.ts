import Prisma, { prismaClient } from '@lib/prisma'

import prismaErrorCatcher from '@services/error/prismaErrorCatcher'

export const createAuth = async (authCreateArgs: Prisma.AuthCreateArgs) => {
  try {
    const auth = await prismaClient.auth.create({ ...authCreateArgs, include: { profile: { include: { role: true } } } })
    return auth
  } catch (error) {
    throw prismaErrorCatcher(error)
  }
}

export const getAuthByIdentifier = async (authFindUniqueArgs: Prisma.AuthFindUniqueArgs) => {
  try {
    const auth = await prismaClient.auth.findUnique({ ...authFindUniqueArgs, include: { profile: { include: { role: true } } } })
    return auth
  } catch (error) {
    throw prismaErrorCatcher(error)
  }
}

export const getAuthByProvider = async (providerFindUniqueArgs: Prisma.ProviderFindUniqueArgs) => {
  try {
    const provider = await prismaClient.provider.findUnique({ ...providerFindUniqueArgs, include: { auth: { include: { providers: true, profile: { include: { role: true } } } } } })
    return provider?.auth
  } catch (error) {
    throw prismaErrorCatcher(error)
  }
}

export const getAuthByProfile = async (profileFindUniqueArgs: Prisma.ProfileFindUniqueArgs) => {
  try {
    const profile = await prismaClient.profile.findUnique({ ...profileFindUniqueArgs, include: { auth: { include: { providers: true, profile: { include: { role: true } } } } } })
    return profile?.auth
  } catch (error) {
    throw prismaErrorCatcher(error)
  }
}

export const getAuthByEmail = async (email: Prisma.AuthFindUniqueArgs['where']['email']) => {
  try {
    const auth = await prismaClient.auth.findUnique({ where: { email }, include: { profile: { include: { role: true } } } })
    return auth
  } catch (error) {
    throw prismaErrorCatcher(error)
  }
}

export const updateAuth = async (authUpdateArgs: Prisma.AuthUpdateArgs) => {
  try {
    const auth = await prismaClient.auth.update({ ...authUpdateArgs, include: { profile: { include: { role: true } } } })
    return auth
  } catch (error) {
    throw prismaErrorCatcher(error)
  }
}

export const deleteAuth = async (authDeleteArgs: Prisma.AuthDeleteArgs) => {
  try {
    const auth = await prismaClient.auth.delete({ ...authDeleteArgs })
    return auth
  } catch (error) {
    throw prismaErrorCatcher(error)
  }
}
