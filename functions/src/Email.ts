import * as functions from 'firebase-functions'
import { createTransport } from 'nodemailer'

const config = functions.config().gmail
const transport = createTransport({
	service: 'gmail',
	auth: {
		user: config.email,
		pass: config.password
	}
})

export default class Email {
	static send(to: string, { subject, body }: { subject: string, body: string }): Promise<void> {
		return transport.sendMail({ from: config.email, to, subject, text: body })
	}
}