import { NextFunction, Request, Response } from 'express'

import ApiError from '@services/error/ApiError'

export const authorizeProfile = (scope: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.params.id && req.params.id === req.auth.profile.id) {
      scope = scope.concat('-self')
    }
    if (req.auth.profile.role.scopes.includes(scope)) {
      return next()
    }
    return next(new ApiError(403, 'Forbidden', 'Insufficient permissions'))
  }
}
