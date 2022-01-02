import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const connect = async () => {
  try {
    await prisma.$connect()
    console.log('Connected to Database')
  } catch (error) {
    console.error(error)
  }
}

export const disconnect = async () => {
  try {
    await prisma.$disconnect()
    console.log('Disconnected from Database')
  } catch (error) {
    console.error(error)
  }
}

export default prisma
