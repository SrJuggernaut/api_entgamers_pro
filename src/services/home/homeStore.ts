import Prisma, { prismaClient } from '@lib/prisma'

import prismaErrorCatcher from '@services/error/prismaErrorCatcher'

export const getHome = async () => {
  try {
    const home = await prismaClient.home.findFirst()
    return home
  } catch (error) {
    throw prismaErrorCatcher(error)
  }
}

export const updateHome = async (homeUpdateArgs: Prisma.HomeUpdateArgs) => {
  try {
    const updatedHome = await prismaClient.home.update({ ...homeUpdateArgs })
    return updatedHome
  } catch (error) {
    throw prismaErrorCatcher(error)
  }
}

export const deleteHome = async (id: Prisma.HomeDeleteArgs['where']['id']) => {
  try {
    const deletedHome = await prismaClient.home.delete({
      where: { id }
    })
    return deletedHome
  } catch (error) {
    throw prismaErrorCatcher(error)
  }
}
