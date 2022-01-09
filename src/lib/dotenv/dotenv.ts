import dotenv from 'dotenv'

dotenv.config()

export const PORT = process.env.PORT || 3000

export const JWT_SECRET = process.env.JWT_SECRET || ''

export const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID || ''
export const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET || ''
export const DISCORD_REDIRECT_URI = process.env.DISCORD_REDIRECT_URI || ''
