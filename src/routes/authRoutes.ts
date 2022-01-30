import bcrypt from 'bcrypt'
import { Prisma } from '@prisma/client'
import { NextFunction, Request, Response, Router } from 'express'
import fetch from 'isomorphic-fetch'
import passport from 'passport'
import { addSeconds } from 'date-fns'

import { validateLogin, validateRegister, validateAuthDiscord, validateAuthLocal, validateVerify } from '@services/validation/authValidation'
import { createAuth, updateAuth } from '@services/auth/authStore'
import { DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, DISCORD_REDIRECT_URI } from '@lib/dotenv/dotenv'
import { createAuthToken, createVerifyToken, verifyVerifyToken } from '@lib/jwt/jwt'
import verifyAuthMail from '@services/mail/verifyAuthMail'

interface DiscordOauthTokenResponse {
  access_token: string,
  refresh_token: string,
  expires_in: number,
  scope: string,
  token_type: string
}

interface DiscordUserResponse {
  id: string,
  username: string,
  avatar: string
  discriminator: string
  public_flags: number
  flags: number
  banner?: string
  banner_color?: string
  accent_color?: string
  locale?: string
  mfa_enabled: boolean
  email: string
  verified: boolean
}

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
        },
        providers: {
          create: {
            name: 'local',
            apiIdentifier: email
          }
        }
      }
    }
    try {
      const createdAuth = await createAuth(authToCreate)
      const token = createVerifyToken(createdAuth)
      await verifyAuthMail({ email, userName }, token)
      res.status(200).json({
        message: 'Successfully registered, please check your email to verify your account.'
      })
    } catch (error) {
      next(error)
    }
  }
)

authRoutes.post('/register/discord',
  validateAuthDiscord,
  async (req: Request, res:Response, next:NextFunction) => {
    const paramsToToken = new URLSearchParams({
      client_id: DISCORD_CLIENT_ID,
      client_secret: DISCORD_CLIENT_SECRET,
      grant_type: 'authorization_code',
      code: req.body.code,
      redirect_uri: DISCORD_REDIRECT_URI
    })
    const randomPassword = await bcrypt.hash(Math.random().toString(36).slice(-8), 10)
    try {
      const resToken = await fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        body: paramsToToken
      })
      const jsonToken = (await resToken.json()) as DiscordOauthTokenResponse
      const resUser = await fetch('https://discord.com/api/users/@me', {
        headers: {
          Authorization: `Bearer ${jsonToken.access_token}`
        }
      })
      const jsonUser = (await resUser.json()) as DiscordUserResponse
      const authToCreate: Prisma.AuthCreateArgs = {
        data: {
          email: jsonUser.email,
          password: randomPassword,
          profile: {
            create: {
              email: jsonUser.id,
              userName: jsonUser.username
            }
          },
          providers: {
            create: {
              name: 'discord',
              apiIdentifier: jsonUser.id,
              apiToken: jsonToken.access_token,
              apiRefreshToken: jsonToken.refresh_token,
              expiresAt: addSeconds(new Date(), jsonToken.expires_in)
            }
          }
        }
      }
      const createdAuth = await createAuth(authToCreate)
      const token = createVerifyToken(createdAuth)
      await verifyAuthMail({ email: jsonUser.email, userName: jsonUser.username }, token)
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
  passport.authenticate('local', { session: false }),
  async (req: Request, res:Response, next:NextFunction) => {
    if (!req.user.confirmed) {
      return res.status(401).json({
        message: 'Please verify your account first.'
      })
    }
    try {
      const token = createAuthToken(req.user)
      res.status(200).json({
        message: 'Successfully logged in',
        data: {
          token: token,
          user: req.user
        }
      })
    } catch (error) {
      next(error)
    }
  }
)

authRoutes.post('/login/discord',
  validateAuthDiscord,
  passport.authenticate('discord', { session: false }),
  async (req: Request, res:Response, next:NextFunction) => {
    if (!req.user.confirmed) {
      return res.status(401).json({
        message: 'Please verify your account first.'
      })
    }
    try {
      const token = createAuthToken(req.user)
      res.status(200).json({
        message: 'Successfully logged in',
        data: {
          token: token,
          user: req.user
        }
      })
    } catch (error) {
      next(error)
    }
  }
)

authRoutes.post('/connect/discord',
  validateAuthDiscord,
  passport.authenticate('jwt', { session: false }),
  async (req: Request, res:Response, next:NextFunction) => {
    const { id } = req.user
    const paramsToToken = new URLSearchParams({
      client_id: DISCORD_CLIENT_ID,
      client_secret: DISCORD_CLIENT_SECRET,
      grant_type: 'authorization_code',
      code: req.body.code,
      redirect_uri: DISCORD_REDIRECT_URI
    })
    try {
      const resToken = await fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        body: paramsToToken
      })
      const jsonToken = (await resToken.json()) as DiscordOauthTokenResponse
      const resUser = await fetch('https://discord.com/api/users/@me', {
        headers: {
          Authorization: `Bearer ${jsonToken.access_token}`
        }
      })
      const jsonUser = (await resUser.json()) as DiscordUserResponse
      const authToCreate: Prisma.AuthUpdateArgs = {
        where: {
          profileId: id
        },
        data: {
          providers: {
            create: {
              name: 'discord',
              apiIdentifier: jsonUser.id,
              apiToken: jsonToken.access_token,
              apiRefreshToken: jsonToken.refresh_token,
              expiresAt: addSeconds(new Date(), jsonToken.expires_in)
            }
          }
        }
      }
      await updateAuth(authToCreate)
      res.status(200).json({
        message: 'Successfully connected'
      })
    } catch (error) {
      next(error)
    }
  }
)

authRoutes.post('/connect/local',
  validateAuthLocal,
  passport.authenticate('jwt', { session: false }),
  async (req: Request, res:Response, _next:NextFunction) => {
    const { id } = req.user
    const authToCreate: Prisma.AuthUpdateArgs = {
      where: {
        profileId: id
      },
      data: {
        providers: {
          create: {
            name: 'local',
            apiIdentifier: req.body.email
          }
        }
      }
    }
    await updateAuth(authToCreate)
    res.status(200).json({
      message: 'Successfully connected'
    })
  }
)

authRoutes.post('/verify',
  validateVerify,
  async (req: Request, res:Response, next:NextFunction) => {
    const { token } = req.body
    try {
      const jwtPayload = verifyVerifyToken(token) as { sub: string }
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
      next(error)
    }
  }
)

export default authRoutes
