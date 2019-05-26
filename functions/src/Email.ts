import * as functions from 'firebase-functions'
import * as nodemailer from 'nodemailer'

const config = functions.config().gmail
const transport = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: config.email,
		pass: config.password
	}
})

export default class Email {
	static send({ to, subject, body }: { to: string, subject: string, body: string }): Promise<any> {
		return transport.sendMail({ from: config.email, to, subject, text: body })
	}
}