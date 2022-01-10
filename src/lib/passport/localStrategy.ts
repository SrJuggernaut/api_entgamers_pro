import bcrypt from 'bcrypt'
import LocalStrategy from 'passport-local'

import { getAuthByIdentifier } from '@services/auth/authStore'

const localStrategy = new LocalStrategy.Strategy({ usernameField: 'email', session: false }, async (email, password, done) => {
  try {
    const auth = await getAuthByIdentifier({
      where: {
        providers: {
          every: {
            name: 'local',
            apiIdentifier: email
          }
        }
      }
    })
    if (!auth) {
      return done(null, false, { message: 'Incorrect email or password' })
    }
    const isMatch = await bcrypt.compare(password, auth.password)
    if (!isMatch) {
      return done(null, false, { message: 'Incorrect email or password' })
    }
    return done(null, auth.profile)
  } catch (error) {
    done(error)
  }
})

export default localStrategy
