import { Prisma } from '@prisma/client'

import ApiError from '@services/error/ApiError'

const prismaErrorCatcher = (error: unknown) => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2000':
      case 'P2007':
      case 'P2009':
      case 'P2011':
      case 'P2012':
      case 'P2013':
      case 'P2019':
        throw new ApiError(400, 'Bad Request', 'Validation Error')
      case 'P2001':
        throw new ApiError(404, 'Not Found')
      case 'P2002':
      case 'P2003':
      case 'P2004':
      case 'P2014':
        throw new ApiError(409, 'Conflict', error.message)
      case 'P2005':
      case 'P2006':
      case 'P2008':
      case 'P2010':
      case 'P2015':
      case 'P2016':
      case 'P2017':
      case 'P2018':
      case 'P2020':
      case 'P2021':
      case 'P2022':
      case 'P2023':
      case 'P2024':
      case 'P2025':
      case 'P2026':
      case 'P2027':
        console.log('unexpected prisma error:', error)
        throw new ApiError()
      default:
        break
    }
  } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    console.log('unexpected prisma error:', error)
    throw new ApiError()
  } else if (error instanceof Prisma.PrismaClientRustPanicError) {
    console.log('unexpected prisma error:', error)
    process.exit(1)
  } else if (error instanceof Prisma.PrismaClientValidationError) {
    console.log('unexpected prisma error:', error)
    throw new ApiError(400, 'Validation Error')
  }
}

export default prismaErrorCatcher
