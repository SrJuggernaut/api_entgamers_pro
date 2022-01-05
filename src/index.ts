import express from 'express'
import passport from 'passport'

import authRoutes from '@routes/authRoutes'
import { PORT } from '@services/config/config'
import { connect } from '@lib/prisma'
import localStrategy from '@lib/passport/localStrategy'
import discordStrategy from '@lib/passport/discordStrategy'

const app = express()

connect()

app.use(express.json())
app.use(passport.initialize())
passport.use(localStrategy)
passport.use(discordStrategy)

app.use('/auth', authRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
