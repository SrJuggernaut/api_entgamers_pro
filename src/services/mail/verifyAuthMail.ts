import { VERIFY_URL } from '@lib/dotenv/dotenv'
import transporter from '@lib/nodemailer/transporter'
import ApiError from '@services/error/ApiError'

export interface UserData {
  email: string
  userName: string
}

const verifyAuthMail = async (userData: UserData, token: string) => {
  try {
    const verifyMail = await transporter.sendMail({
      to: userData.email,
      subject: 'Verify your email',
      html: `
        <h1>Hello ${userData.userName}</h1>
        <p>
          Please verify your email by clicking the link below:
        </p>
        <a href="${VERIFY_URL}?token=${token}">Verify</a>
        <p>
         or copy and paste this link into your browser:
        </p>
        <p>
          ${VERIFY_URL}?token=${token}
        </p>
        <p>
          If you did not request this email, please ignore it.
        </p>
      `
    })
    return verifyMail
  } catch (error) {
    console.log('Error sending mail: ', error)
    throw new ApiError(500, 'Internal Server Error')
  }
}

export default verifyAuthMail
