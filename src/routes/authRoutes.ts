import bcrypt from 'bcrypt'
import { Prisma } from '@prisma/client'
import { NextFunction, Request, Response, Router } from 'express'
import { JsonWebTokenError } from 'jsonwebtoken'

import { validateLogin, validateRegister, validateVerify } from '@services/validation/authValidation'
import { createAuth, getAuthByEmail, updateAuth } from '@services/auth/authStore'
import { createAuthToken, createRecoverPasswordToken, createVerifyToken, verifyToken } from '@lib/jwt/jwt'
import verifyAuthMail from '@services/mail/verifyAuthMail'
import ApiError from '@services/error/ApiError'
import authenticateJwt, { authenticateNotRequiredJwt } from '@services/auth/authenticateJwt'
import authenticateDiscord from '@services/auth/authenticateDiscord'
import recoverPassword from '@services/mail/recoverPassword'

const authRoutes = Router()

authRoutes.post('/register',
  validateRegister,
  async (req: Request, res:Response, next:NextFunction) => {
    const { email, password, userName } = req.body
    const encryptedPassword = await bcrypt.hash(password, 10)
    const authToCreate: Prisma.AuthCreateArgs = {
      data: {
        email: email,
        password: encryptedPassword,
        profile: {
          create: {
            email: email,
            userName: userName
          }
        }
      }
    }
    try {
      const createdAuth = await createAuth(authToCreate)
      const token = createVerifyToken(createdAuth)
      await verifyAuthMail({ email }, token)
      res.status(200).json({
        message: 'Successfully registered, please check your email to verify your account.'
      })
    } catch (error) {
      next(error)
    }
  }
)

authRoutes.post('/login',
  validateLogin,
  async (req: Request, res:Response, next:NextFunction) => {
    if (!req.auth.confirmed) {
      return res.status(401).json({
        message: 'Please verify your account first.'
      })
    }
    try {
      const token = createAuthToken(req.auth)
      res.status(200).json({
        message: 'Successfully logged in',
        data: {
          token: token,
          user: req.auth.profile
        }
      })
    } catch (error) {
      next(error)
    }
  }
)

authRoutes.post('/discord',
  authenticateNotRequiredJwt,
  authenticateDiscord,
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.auth.confirmed) {
      return res.status(401).json({
        message: 'Please verify your account first.'
      })
    }
    try {
      const token = createAuthToken(req.auth)
      res.status(200).json({
        message: 'Successfully logged in',
        data: {
          token: token,
          user: req.auth.profile
        }
      })
    } catch (error) {
      next(error)
    }
  }
)

authRoutes.post('/verify',
  validateVerify,
  async (req: Request, res:Response, next:NextFunction) => {
    const { token } = req.body
    try {
      const jwtPayload = verifyToken(token) as { sub: string }
      const updatedAuth = await updateAuth({
        where: {
          id: jwtPayload.sub
        },
        data: {
          confirmed: true
        }
      })
      const authToken = createAuthToken(updatedAuth)
      res.status(200).json({
        message: 'Successfully verified',
        data: {
          token: authToken,
          user: updatedAuth?.profile
        }
      })
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        return next(new ApiError(400, 'Bad Request', 'Invalid token'))
      }
      next(error)
    }
  }
)

authRoutes.post('/sendRecoverPassword',
  async (req: Request, res:Response, next:NextFunction) => {
    const { email } = req.body
    try {
      const auth = await getAuthByEmail(email)
      if (auth) {
        const token = createRecoverPasswordToken(auth)
        await recoverPassword({ email }, token)
      }
      res.status(200).json({
        message: 'Successfully sent recover password email'
      })
    } catch (error) {
      next(error)
    }
  }
)

authRoutes.post('/recoverPassword',
  async (req: Request, res:Response, next:NextFunction) => {
    const { token, password } = req.body
    try {
      const jwtPayload = verifyToken(token) as { sub: string }
      const updatedAuth = await updateAuth({
        where: {
          id: jwtPayload.sub
        },
        data: {
          password: await bcrypt.hash(password, 10)
        }
      })
      const authToken = createAuthToken(updatedAuth)
      res.status(200).json({
        message: 'Successfully changed password',
        data: {
          token: authToken,
          user: updatedAuth?.profile
        }
      })
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        return next(new ApiError(400, 'Bad Request', 'Invalid token'))
      }
      next(error)
    }
  }
)

authRoutes.post('/changePassword',
  authenticateJwt,
  async (req: Request, res:Response, next:NextFunction) => {
    try {
      const { password } = req.body
      const updatedAuth = await updateAuth({
        where: {
          id: req.auth.id
        },
        data: {
          password: await bcrypt.hash(password, 10)
        }
      })
      const authToken = createAuthToken(updatedAuth)
      res.status(200).json({
        message: 'Successfully changed password',
        data: {
          token: authToken,
          user: updatedAuth?.profile
        }
      })
    } catch (error) {
      next(error)
    }
  }
)

authRoutes.post('/changeEmail',
  authenticateJwt,
  async (req: Request, res:Response, next:NextFunction) => {
    try {
      const { email } = req.body
      const updatedAuth = await updateAuth({
        where: {
          id: req.auth.id
        },
        data: {
          email
        }
      })
      const authToken = createAuthToken(updatedAuth)
      res.status(200).json({
        message: 'Successfully changed email',
        data: {
          token: authToken,
          user: updatedAuth?.profile
        }
      })
    } catch (error) {
      next(error)
    }
  }
)

export default authRoutes
