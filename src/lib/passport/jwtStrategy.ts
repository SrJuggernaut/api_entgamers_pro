import passportJwt from 'passport-jwt'

import { JWT_SECRET } from '@lib/dotenv/dotenv'
import { getAuthByIdentifier } from '@services/auth/authStore'

const JwtStrategy = new passportJwt.Strategy({
  jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET
}, async (jwtPayload, done) => {
  try {
    const auth = await getAuthByIdentifier({
      where: {
        id: jwtPayload.sub
      }
    })
    if (!auth) {
      return done(null, false, { message: 'Incorrect email or password' })
    }
    return done(null, auth.profile)
  } catch (error) {
    done(error)
  }
})

export default JwtStrategy
