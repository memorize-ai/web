import { https } from 'firebase-functions'
import * as admin from 'firebase-admin'

import User from '../../User'
import { sendEmail, EmailTemplate } from '../../Email'

const { onCall, HttpsError } = https
const firestore = admin.firestore()

export default onCall(async (data, { auth }) => {
	if (!auth)
		throw new HttpsError('unauthenticated', 'You need to be signed in')
	
	if (typeof data !== 'object')
		throw new HttpsError('invalid-argument', 'You must pass in an object')
	
	const { id, subject, body } = data
	
	if (!(typeof id === 'string' && typeof subject === 'string' && typeof body === 'string'))
		throw new HttpsError(
			'invalid-argument',
			'You must specify an "id", "subject", and "body" as strings'
		)
	
	const [from, to] = await Promise.all([
		User.fromId(auth.uid),
		User.fromId(id)
	])
	
	if (!to.allowContact || await to.didBlockUserWithId(from.id))
		throw new HttpsError(
			'permission-denied',
			'You were blocked or the recipient does not allow contact'
		)
	
	const doc = firestore.collection('messages').doc()
	
	await Promise.all([
		doc.create({
			from: from.id,
			to: to.id,
			subject,
			body
		}),
		sendEmail({
			template: EmailTemplate.ContactUser,
			to: to.emailUser,
			replyTo: from.emailUser,
			context: {
				subject,
				body,
				from: {
					name: from.name,
					email: from.email
				},
				to: {
					name: to.name
				},
				block_url: `https://memorize.ai/block/${to.id}/${from.id}`,
				report_url: `https://memorize.ai/report/${from.id}/message/${doc.id}`,
				restrict_contact_url: `https://memorize.ai/restrict-contact/${to.id}`
			}
		})
	])
})
