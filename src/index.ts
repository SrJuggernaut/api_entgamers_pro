import express from 'express'

import { PORT } from '@config/config'
import { connect } from '@lib/prisma'

const app = express()

connect()

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
