import { https } from 'firebase-functions'
import * as admin from 'firebase-admin'

import User from '../../User'
import { sendEmail, EmailTemplate, DEFAULT_FROM } from '../../Email'
import { pingable } from '../../utils'

const { onCall, HttpsError } = https
const firestore = admin.firestore()

export default onCall(pingable(async data => {
	if (typeof data !== 'object')
		throw new HttpsError('invalid-argument', 'You must pass in an object')
	
	const {
		from: fromId,
		to: toId,
		message: messageId,
		reason
	} = data
	
	if (!(
		typeof fromId === 'string' &&
		typeof toId === 'string' &&
		typeof messageId === 'string' &&
		typeof reason === 'string'
	))
		throw new HttpsError(
			'invalid-argument',
			'You must specify a "from", "to", "message", and "reason" as strings'
		)
	
	const [from, to, message] = await Promise.all([
		User.fromId(fromId),
		User.fromId(toId),
		firestore.doc(`messages/${messageId}`).get()
	])
	
	if (!message.exists)
		throw new HttpsError(
			'failed-precondition',
			'The message does not exist'
		)
	
	await sendEmail({
		template: EmailTemplate.ReportMessage,
		to: DEFAULT_FROM,
		replyTo: to.emailUser,
		context: {
			from: {
				id: from.id,
				...from.emailUser
			},
			to: {
				id: to.id,
				...to.emailUser
			},
			reason,
			subject: message.get('subject'),
			body: message.get('body')
		}
	})
}))
