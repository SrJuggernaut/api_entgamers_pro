import bcrypt from 'bcrypt'
import { Prisma, Auth } from '@prisma/client'
import { NextFunction, Request, Response, Router } from 'express'
import fetch from 'isomorphic-fetch'
import passport from 'passport'
import { addSeconds } from 'date-fns'

import { validateLogin, validateRegister, validateAuthDiscord } from '@services/validation/authValidation'
import { createAuth } from '@services/auth/authStore'
import { DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, DISCORD_REDIRECT_URI } from '@lib/dotenv/dotenv'
import { createAuthToken } from '@lib/jwt/jwt'

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
      res.status(200).json({
        message: 'Registering user',
        data: createdAuth?.profile
      }).send()
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
      res.status(200).json({
        message: 'Registering user',
        data: createdAuth?.profile
      }).send()
    } catch (error) {
      next(error)
    }
  }
)

authRoutes.post('/login',
  validateLogin,
  passport.authenticate('local', { session: false }),
  async (req: Request, res:Response, next:NextFunction) => {
    try {
      const token = createAuthToken(req.user as Auth)
      res.status(200).json({
        message: 'Logging in user',
        data: {
          token: token,
          user: req.user
        }
      }).send()
    } catch (error) {
      next(error)
    }
  }
)

authRoutes.post('/login/discord',
  validateAuthDiscord,
  passport.authenticate('discord', { session: false }),
  async (req: Request, res:Response, next:NextFunction) => {
    try {
      const token = createAuthToken(req.user as Auth)
      res.status(200).json({
        message: 'Logging in user',
        data: {
          token: token,
          user: req.user
        }
      }).send()
    } catch (error) {
      next(error)
    }
  }
)

export default authRoutes
