import express from 'express'
import cors from 'cors'

import authRoutes from '@routes/authRoutes'
import { PORT } from '@lib/dotenv'
import { connect } from '@lib/prisma'
import errorHandler from '@services/error/errorHandler'

const app = express()

connect()

app.use(express.json())
app.use(cors())

app.use('/auth', authRoutes)

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
