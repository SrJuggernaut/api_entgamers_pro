import Prisma, { prismaClient } from '@lib/prisma'
import prismaErrorCatcher from '@services/error/prismaErrorCatcher'

export const getProfiles = async (profileFindManyArgs?: Prisma.ProfileFindManyArgs) => {
  try {
    const profiles = await prismaClient.profile.findMany({ ...profileFindManyArgs })
    return profiles
  } catch (error) {
    throw prismaErrorCatcher(error)
  }
}

export const getProfileByIdentifier = async (profileWhereUniqueInput: Prisma.ProfileFindUniqueArgs) => {
  try {
    const profile = await prismaClient.profile.findUnique({ ...profileWhereUniqueInput })
    return profile
  } catch (error) {
    throw prismaErrorCatcher(error)
  }
}

export const updateProfile = async (profileUpdateArgs: Prisma.ProfileUpdateArgs) => {
  try {
    const profile = await prismaClient.profile.update({ ...profileUpdateArgs })
    return profile
  } catch (error) {
    throw prismaErrorCatcher(error)
  }
}

export const deleteProfile = async (profileDeleteArgs: Prisma.ProfileDeleteArgs) => {
  try {
    const profile = await prismaClient.profile.delete({ ...profileDeleteArgs })
    return profile
  } catch (error) {
    throw prismaErrorCatcher(error)
  }
}
