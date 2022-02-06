import bcrypt from 'bcrypt'
import { Prisma } from '@prisma/client'
import { NextFunction, Request, Response, Router } from 'express'
import { JsonWebTokenError } from 'jsonwebtoken'

import { validateChangeEmail, validateChangePassword, validateDiscord, validateLogin, validateRecoverPassword, validateRegister, validateRequestEmailChange, validateResendVerify, validateSendRecoverPassword, validateVerify } from '@services/validation/auth'
import { createAuth, deleteAuth, getAuthByEmail, updateAuth } from '@services/auth/authStore'
import { createBearerToken, createChangeEmailToken, createRecoverPasswordToken, createVerifyEmailToken, verifyChangeEmailToken, verifyRecoverPasswordToken, verifyVerifyEmailToken } from '@lib/jsonwebtoken'
import sendVerifyAuthEmailEmail from '@services/mail/sendVerifyAuthEmailEmail'
import sendRecoverPasswordEmail from '@services/mail/sendRecoverPasswordEmail'
import sendChangeEmailEmail from '@services/mail/sendChangeEmailEmail'
import ApiError from '@services/error/ApiError'
import authenticateJwt, { notRequiredAuthenticateJwt } from '@services/auth/authenticateJwt'
import authenticateDiscord from '@services/auth/authenticateDiscord'
import authenticateLocal from '@services/auth/authenticateLocal'

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
            userName: userName,
            role: { connect: { name: 'user' } }
          }
        }
      }
    }
    try {
      const createdAuth = await createAuth(authToCreate)
      const token = createVerifyEmailToken(createdAuth)
      await sendVerifyAuthEmailEmail({ email }, token)
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
  authenticateLocal,
  async (req: Request, res:Response, next:NextFunction) => {
    const { trusted } = req.body
    if (!req.auth.confirmed) {
      return res.status(401).json({
        message: 'Please verify your account first.'
      })
    }
    try {
      const token = createBearerToken(req.auth, trusted)
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
  notRequiredAuthenticateJwt,
  authenticateDiscord,
  validateDiscord,
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.auth.confirmed) {
      return next(new ApiError(401, 'Unauthorized', 'Please verify your account first.'))
    }
    try {
      const token = createBearerToken(req.auth, true)
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
      const jwtPayload = verifyVerifyEmailToken(token)
      const updatedAuth = await updateAuth({
        where: {
          id: jwtPayload.sub
        },
        data: {
          confirmed: true
        }
      })
      const authToken = createBearerToken(updatedAuth, true)
      res.status(200).json({
        message: 'Successfully verified email',
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

authRoutes.post('/resend-verify',
  validateResendVerify,
  async (req: Request, res:Response, next:NextFunction) => {
    const { email } = req.body
    try {
      const auth = await getAuthByEmail(email)
      if (!auth) {
        return next(new ApiError(404, 'Not Found', 'Email not found'))
      }
      if (auth.confirmed) {
        return next(new ApiError(400, 'Bad Request', 'Email already verified'))
      }
      const token = createVerifyEmailToken(auth)
      sendVerifyAuthEmailEmail({ email }, token)
      res.status(200).json({
        message: 'Successfully sent email'
      })
    } catch (error) {
      next(error)
    }
  }
)

authRoutes.post('/send-recover-password',
  validateSendRecoverPassword,
  async (req: Request, res:Response, next:NextFunction) => {
    const { email } = req.body
    try {
      const auth = await getAuthByEmail(email)
      if (auth) {
        const token = createRecoverPasswordToken(auth)
        await sendRecoverPasswordEmail({ email }, token)
      }
      res.status(200).json({
        message: 'Successfully sent recover password email'
      })
    } catch (error) {
      next(error)
    }
  }
)

authRoutes.post('/recover-password',
  validateRecoverPassword,
  async (req: Request, res:Response, next:NextFunction) => {
    const { token, password } = req.body
    try {
      const jwtPayload = verifyRecoverPasswordToken(token) as { sub: string }
      const updatedAuth = await updateAuth({
        where: {
          id: jwtPayload.sub
        },
        data: {
          password: await bcrypt.hash(password, 10)
        }
      })
      if (updatedAuth) {
        res.status(200).json({
          message: 'Successfully changed password'
        })
      }
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        return next(new ApiError(400, 'Bad Request', 'Invalid token'))
      }
      next(error)
    }
  }
)

authRoutes.post('/change-password',
  authenticateJwt,
  validateChangePassword,
  async (req: Request, res:Response, next:NextFunction) => {
    const { password } = req.body
    try {
      const updatedAuth = await updateAuth({
        where: {
          id: req.auth.id
        },
        data: {
          password: await bcrypt.hash(password, 10)
        }
      })
      if (updatedAuth) {
        res.status(200).json({
          message: 'Successfully changed password'
        })
      }
    } catch (error) {
      next(error)
    }
  }
)

authRoutes.post('/request-email-change',
  authenticateJwt,
  validateRequestEmailChange,
  async (req: Request, res:Response, next:NextFunction) => {
    const { newEmail } = req.body
    try {
      const token = createChangeEmailToken(req.auth, newEmail)
      await sendChangeEmailEmail({ email: req.auth.email }, token)
      res.status(200).json({
        message: 'Successfully sent email change request'
      })
    } catch (error) {
      next(error)
    }
  }
)

authRoutes.post('/change-email',
  authenticateJwt,
  validateChangeEmail,
  async (req: Request, res:Response, next:NextFunction) => {
    const { token } = req.body
    try {
      const jwtPayload = verifyChangeEmailToken(token)
      const updatedAuth = await updateAuth({
        where: {
          id: req.auth.id
        },
        data: {
          email: jwtPayload.newEmail
        }
      })
      if (updatedAuth) {
        res.status(200).json({
          message: 'Successfully changed email'
        })
      }
    } catch (error) {
      next(error)
    }
  }
)

authRoutes.delete('/',
  authenticateJwt,
  async (req: Request, res:Response, next:NextFunction) => {
    try {
      const deletedAuth = await deleteAuth({
        where: {
          id: req.auth.id
        }
      })
      if (deletedAuth) {
        res.status(200).json({
          message: 'Successfully deleted account'
        })
      }
    } catch (error) {
      next(error)
    }
  }
)

export default authRoutes
