import dotenv from 'dotenv'

dotenv.config()

export const PORT = process.env.PORT || 3000

export const JWT_SECRET = process.env.JWT_SECRET || ''

export const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID || ''
export const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET || ''
export const DISCORD_REDIRECT_URI = process.env.DISCORD_REDIRECT_URI || ''

export const VERIFY_URL = process.env.VERIFY_URL || ''
export const RECOVER_PASSWORD_URL = process.env.RECOVER_PASSWORD_URL || ''

export const SMTP_FROM = process.env.SMTP_FROM || ''
export const SMTP_FROM_NAME = process.env.SMTP_FROM_NAME || ''
export const SMTP_HOST = process.env.SMTP_HOST || ''
export const SMTP_PASS = process.env.SMTP_PASS || ''
export const SMTP_PORT = parseInt(process.env.SMTP_PORT || '0')
export const SMTP_SECURE = process.env.SMTP_SECURE === 'true' || false
export const SMTP_USER = process.env.SMTP_USER || ''
