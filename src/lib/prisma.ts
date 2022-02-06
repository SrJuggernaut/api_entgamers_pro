import { Prisma, PrismaClient } from '@prisma/client'

export const prismaClient = new PrismaClient()

export const connect = async () => {
  try {
    await prismaClient.$connect()
    console.log('Connected to Database')
  } catch (error) {
    if (error instanceof Prisma.PrismaClientInitializationError) {
      console.error('Could not connect to Database:', error.message)
      process.exit(1)
    }
  }
}

export const disconnect = async () => {
  try {
    await prismaClient.$disconnect()
    console.log('Disconnected from Database')
  } catch (error) {
    console.error(error)
  }
}

export default Prisma
