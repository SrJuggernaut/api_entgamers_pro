import express from 'express'
import cors from 'cors'

import authRoutes from '@routes/authRoutes'
import { PORT } from '@lib/dotenv'
import { connect } from '@lib/prisma'
import errorHandler from '@services/error/errorHandler'
import profileRoutes from '@routes/profileRoutes'
import homeRoutes from '@routes/homeRoutes'

const app = express()

connect()

app.use(express.json())
app.use(cors())

app.use('/auth', authRoutes)
app.use('/profiles', profileRoutes)
app.use('/home', homeRoutes)

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
