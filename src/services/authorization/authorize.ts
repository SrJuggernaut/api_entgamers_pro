import { NextFunction, Request, Response } from 'express'

import ApiError from '@services/error/ApiError'

const authorize = (scope: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.auth.profile.role.scopes.includes(scope)) {
      return next()
    }
    return next(new ApiError(403, 'Forbidden', 'Insufficient permissions'))
  }
}

export default authorize
