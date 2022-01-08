import DiscordStrategy from 'passport-discord'

import { getAuthByIdentifier } from '@services/auth/authStore'
import { DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, DISCORD_REDIRECT_URI } from '@lib/dotenv/dotenv'

const discordStrategy = new DiscordStrategy.Strategy({
  clientID: DISCORD_CLIENT_ID,
  clientSecret: DISCORD_CLIENT_SECRET,
  callbackURL: DISCORD_REDIRECT_URI,
  scope: ['identify', 'email']
}, async (accessToken, refreshToken, profile, done) => {
  console.log('profile', profile)
  try {
    const auth = await getAuthByIdentifier({
      where: {
        providers: {
          every: {
            identifier: profile.id,
            name: 'discord'
          }
        }
      }
    })
    if (!auth) {
      return done(null, false, { message: "user can't be found" })
    }
    return done(null, auth.profile)
  } catch (error) {
    done(error as Error)
  }
})

export default discordStrategy
