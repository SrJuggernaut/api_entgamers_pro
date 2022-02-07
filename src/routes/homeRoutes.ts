import { NextFunction, Request, Response, Router } from 'express'

import authenticateJwt from '@services/auth/authenticateJwt'
import { getHome, updateHome } from '@services/home/homeStore'
import ApiError from '@services/error/ApiError'
import { validateUpdateHome } from '@services/validation/home'
import authorize from '@services/authorization/authorize'

const homeRoutes = Router()

homeRoutes.use(authenticateJwt)

homeRoutes.get('/',
  authorize('home:get'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const home = await getHome()
      if (!home) {
        return next(new ApiError(404, 'Not Found', 'Home not found'))
      }
      res.json({
        message: 'retrieved home',
        data: { ...home }
      })
    } catch (error) {
      next(error)
    }
  }
)

homeRoutes.put('/',
  authorize('home:update'),
  validateUpdateHome,
  async (req: Request, res: Response, next: NextFunction) => {
    const { body } = req
    try {
      const home = await getHome()
      if (!home) {
        return next(new ApiError(404, 'Not Found', 'Home not found'))
      }
      const updatedHome = await updateHome({ where: { id: home.id }, data: body })
      res.json({
        message: 'updated home',
        data: { ...updatedHome }
      })
    } catch (error) {
      next(error)
    }
  }
)

export default homeRoutes
