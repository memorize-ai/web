import * as functions from 'firebase-functions'
import { createTransport } from 'nodemailer'
import { promisify } from 'util'
import { readFile } from 'fs'

const config = functions.config().gmail
const transport = createTransport({
	service: 'gmail',
	auth: {
		user: config.email,
		pass: config.password
	}
})

export enum EmailType {
	invitation = 'invitation'
}

export default class Email {
	static send(type: EmailType, { to, subject }: { to: string, subject: string }, context: any): Promise<void> {
		return Email.read(type).then(email =>
			transport.sendMail({ from: config.email, to, subject, text: Email.replace(email, context) })
		)
	}

	private static replace(email: string, context: any): string {
		return Object.keys(context).reduce((acc, key) =>
			acc.replace(`{{ ${key} }}`, context[key])
		, email)
	}

	private static read(type: EmailType): Promise<string> {
		return promisify(readFile)(`../emails/${type.valueOf()}.html`, 'utf8')
	}
}