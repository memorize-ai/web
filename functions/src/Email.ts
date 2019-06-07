import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { createTransport } from 'nodemailer'
import { render } from 'nunjucks'

import Setting from './Setting'

const firestore = admin.firestore()
const config = functions.config().gmail
const transport = createTransport({
	service: 'gmail',
	auth: {
		user: config.email,
		pass: config.password
	}
})

export enum EmailType {
	accessRemoved = 'access-removed',
	inviteConfirmed = 'invite-confirmed',
	invited = 'invited',
	roleChanged = 'role-changed',
	uninvited = 'uninvited',
	youConfirmedInvite = 'you-confirmed-invite'
}

export default class Email {
	static send(type: EmailType, { to, subject }: { to: string, subject: string }, context?: object): Promise<void> {
		return Setting.get<boolean>('email-notifications', to).then(value => value
			? firestore.doc(`users/${to}`).get().then(user =>
				transport.sendMail({
					from: config.email,
					to: user.get('email'),
					subject,
					text: render(`../emails/${type.valueOf()}.html`, context)
				})
			)
			: Promise.resolve()
		)
	}
}