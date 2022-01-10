import passportJwt from 'passport-jwt'

import { JWT_SECRET } from '@lib/dotenv/dotenv'
import { getAuthByProfile } from '@services/auth/authStore'

const JwtStrategy = new passportJwt.Strategy({
  jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET
}, async (jwtPayload, done) => {
  try {
    const auth = await getAuthByProfile({
      where: {
        id: jwtPayload.sub
      }
    })
    if (!auth) {
      return done(null, false, { message: 'invalid token' })
    }
    return done(null, auth.profile)
  } catch (error) {
    done(error)
  }
})

export default JwtStrategy
