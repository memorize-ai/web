import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { createTransport } from 'nodemailer'
import { render } from 'nunjucks'
import { join } from 'path'

import Setting from './Setting'

export const emails: {
	support: EmailAccount
} = functions.config().emails

const firestore = admin.firestore()
const transport = createTransport({
	service: 'gmail',
	auth: {
		user: emails.support.email,
		pass: emails.support.password
	}
})

export type EmailAccount = { email: string, password: string }

export default class Email {
	static send(type: EmailType, { to, subject }: { to: string, subject: string }, context?: object): Promise<boolean> {
		return Email.sendEmail(to, subject, render(join(__dirname, `../emails/${type.valueOf()}.html`), context))
	}

	static sendEmail(to: string, subject: string, body: string): Promise<boolean> {
		return Setting.get<boolean>('email-notifications', to).then(value =>
			value
				? firestore.doc(`users/${to}`).get().then(user => {
					const email: string | undefined = user.get('email')
					return email
						? transport.sendMail({
							from: emails.support.email,
							to: email,
							subject,
							text: body
						}).then(() => true).catch(() => false)
						: false
				})
				: false
		)
	}
}

export enum EmailType {
	accessRemoved = 'access-removed',
	inviteConfirmed = 'invite-confirmed',
	invited = 'invited',
	roleChanged = 'role-changed',
	uninvited = 'uninvited',
	youConfirmedInvite = 'you-confirmed-invite'
}