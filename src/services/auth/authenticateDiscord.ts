import axios from 'axios'
import bcrypt from 'bcrypt'
import { NextFunction, Request, Response } from 'express'

import { DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, DISCORD_REDIRECT_URI } from '@lib/dotenv'
import { createAuth, getAuthByProvider, updateAuth } from '@services/auth/authStore'
import ApiError from '@services/error/ApiError'
import { addSeconds } from 'date-fns'
import verifyAuthMail from '@services/mail/sendVerifyAuthEmailEmail'
import sendRegisterWithProviderEmail from '@services/mail/sendRegisterWithProviderEmail'
import { createVerifyEmailToken } from '@lib/jsonwebtoken'

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

const authenticateDiscord = async (req: Request, res: Response, next: NextFunction) => {
  const code = req.body.code
  if (!code) {
    return next(new ApiError(401, 'Unauthorized', 'No code provided'))
  }
  try {
    const params = new URLSearchParams()
    params.append('client_id', DISCORD_CLIENT_ID)
    params.append('client_secret', DISCORD_CLIENT_SECRET)
    params.append('grant_type', 'authorization_code')
    params.append('code', code)
    params.append('redirect_uri', DISCORD_REDIRECT_URI)
    const oauthTokenResponse = await axios.post<DiscordOauthTokenResponse>('https://discord.com/api/oauth2/token', params)
    const oauthToken = oauthTokenResponse.data.access_token
    const userResponse = await axios.get<DiscordUserResponse>('https://discord.com/api/users/@me', { headers: { Authorization: `Bearer ${oauthToken}` } })
    const user = userResponse.data
    const avatar = user.avatar.startsWith('a_')
      ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.gif`
      : `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
    const discordData = {
      userName: user.username,
      discriminator: user.discriminator,
      avatar
    }
    const auth = await getAuthByProvider({
      where: {
        name_apiIdentifier: { apiIdentifier: user.id, name: 'discord' }
      }
    })
    if (auth) {
      req.auth = auth
      return next()
    }
    if (req.auth) {
      const updatedAuth = await updateAuth({
        where: { id: req.auth.id },
        data: {
          providers: {
            create: {
              apiIdentifier: user.id,
              name: 'discord',
              apiRefreshToken: oauthTokenResponse.data.refresh_token,
              apiToken: oauthToken,
              expiresAt: addSeconds(new Date(), oauthTokenResponse.data.expires_in).toISOString()
            }
          },
          profile: {
            update: {
              discordData
            }
          }
        }
      })
      req.auth = updatedAuth
      return next()
    }
    const createdAuth = await createAuth({
      data: {
        email: user.email,
        password: await bcrypt.hash(Math.random().toString(36).slice(-8), 10),
        confirmed: user.verified,
        profile: {
          create: {
            email: user.email,
            userName: `${user.username}${user.discriminator}`,
            picture: avatar,
            discordData,
            role: { connect: { name: 'user' } }
          }
        },
        providers: {
          create: {
            apiIdentifier: user.id,
            name: 'discord',
            apiRefreshToken: oauthTokenResponse.data.refresh_token,
            apiToken: oauthToken,
            expiresAt: addSeconds(new Date(), oauthTokenResponse.data.expires_in)
          }
        }
      }
    })

    if (!createdAuth.confirmed) {
      const token = createVerifyEmailToken(createdAuth)
      await verifyAuthMail({ email: createdAuth.email }, token)
    } else {
      await sendRegisterWithProviderEmail({ email: createdAuth.email }, 'discord')
    }
    req.auth = createdAuth
    return next()
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return next(new ApiError(503, 'Service Unavailable', 'Discord API is unavailable'))
    } else {
      console.log(error)
      return next(new ApiError(500, 'Internal Server Error', 'An error occurred while authenticating with Discord'))
    }
  }
}

export default authenticateDiscord
