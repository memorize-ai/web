import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { createTransport } from 'nodemailer'
import { promisify } from 'util'
import { readFile } from 'fs'

import Setting from './Setting'

const firestore = admin.firestore()
const readFilePromise = promisify(readFile)
const config = functions.config().gmail
const transport = createTransport({
	service: 'gmail',
	auth: {
		user: config.email,
		pass: config.password
	}
})

export enum EmailType {
	accessRemoved = 'accessRemoved',
	invitation = 'invitation',
	roleChanged = 'roleChanged',
	uninvited = 'uninvited'
}

export default class Email {
	static send(type: EmailType, { to, subject }: { to: string, subject: string }, context: any): Promise<void> {
		return Setting.get<boolean>('email-notifications', to).then(value => value
			? firestore.doc(`users/${to}`).get().then(user =>
				Email.read(type).then(email =>
					transport.sendMail({ from: config.email, to: user.get('email'), subject, text: Email.replace(email, context) })
				)
			)
			: Promise.resolve()
		)
	}

	private static replace(email: string, context: any): string {
		return Object.keys(context).reduce((acc, key) =>
			acc.replace(`{{ ${key} }}`, context[key])
		, email)
	}

	private static read(type: EmailType): Promise<string> {
		return readFilePromise(`../emails/${type.valueOf()}.html`, 'utf8')
	}
}