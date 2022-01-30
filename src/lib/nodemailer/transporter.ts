import nodemailer from 'nodemailer'

import { SMTP_FROM, SMTP_FROM_NAME, SMTP_HOST, SMTP_PASS, SMTP_PORT, SMTP_SECURE, SMTP_USER } from '@lib/dotenv/dotenv'

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_SECURE,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS
  }
}, {
  from: `${SMTP_FROM_NAME} <${SMTP_FROM}>`,
  replyTo: `${SMTP_FROM_NAME} <${SMTP_FROM}>`
})

export default transporter
