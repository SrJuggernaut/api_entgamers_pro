import { NextFunction, Request, Response } from 'express'

import ApiError from '@services/error/ApiError'

const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof ApiError) {
    res.status(error.statusCode).json({
      status: error.statusCode,
      error: error.errorType,
      message: error.message
    })
  } else {
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    })
  }
}

export default errorHandler
