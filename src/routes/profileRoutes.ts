import { NextFunction, Request, Response, Router } from 'express'

import authenticateJwt from '@services/auth/authenticateJwt'
import { getProfileByIdentifier, getProfiles, updateProfile } from '@services/profile/profileStore'
import { authorizeProfile } from '@services/authorization/authorizeProfile'
import { validateProfileIdParam, validateUpdateProfile } from '@services/validation/profile'

const profileRoutes = Router()

profileRoutes.use(authenticateJwt)

profileRoutes.get('/',
  authorizeProfile('profile:get'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const profiles = await getProfiles()
      res.status(200).json({
        message: 'profiles retrieved',
        data: [...profiles]
      })
    } catch (error) {
      next(error)
    }
  }
)

profileRoutes.get('/me',
  authorizeProfile('profile:get-self'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const profile = await getProfileByIdentifier({ where: { id: req.auth.profile.id } })
      res.status(200).json({
        message: 'profile retrieved',
        data: { ...profile }
      })
    } catch (error) {
      next(error)
    }
  }
)

profileRoutes.get('/:id',
  authorizeProfile('profile:get'),
  validateProfileIdParam,
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    try {
      const profile = await getProfileByIdentifier({ where: { id } })
      res.status(200).json({
        message: 'profile retrieved',
        data: { ...profile }
      })
    } catch (error) {
      next(error)
    }
  }
)

profileRoutes.put('/me',
  authorizeProfile('profile:update-self'),
  validateUpdateProfile,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updatedProfile = await updateProfile({ where: { id: req.auth.profile.id }, data: req.body })
      res.status(200).json({
        message: 'profile updated',
        data: { ...updatedProfile }
      })
    } catch (error) {
      next(error)
    }
  }
)

profileRoutes.put('/:id',
  authorizeProfile('profile:update'),
  validateProfileIdParam,
  validateUpdateProfile,
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    try {
      const updatedProfile = await updateProfile({ where: { id }, data: req.body })
      res.status(200).json({
        message: 'profile updated',
        data: { ...updatedProfile }
      })
    } catch (error) {
      next(error)
    }
  }
)

export default profileRoutes
