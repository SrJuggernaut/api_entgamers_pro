import express from 'express'
import passport from 'passport'

import authRoutes from '@routes/authRoutes'
import { PORT } from '@lib/dotenv/dotenv'
import { connect } from '@lib/prisma/prisma'
import localStrategy from '@lib/passport/localStrategy'
import discordStrategy from '@lib/passport/discordStrategy'
import jwtStrategy from '@lib/passport/jwtStrategy'
import errorHandler from '@services/error/errorHandler'

const app = express()

connect()

app.use(express.json())
app.use(passport.initialize())

passport.use(localStrategy)
passport.use(discordStrategy)
passport.use(jwtStrategy)

app.use('/auth', authRoutes)

app.use(passport.authorize('jwt', { session: false }))

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
