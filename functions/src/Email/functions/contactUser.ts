import { https } from 'firebase-functions'

import User from '../../User'
import { sendEmail, EmailTemplate } from '../../Email'

const { onCall, HttpsError } = https

export default onCall(async (data, { auth }) => {
	if (!auth)
		throw new HttpsError('unauthenticated', 'You need to be signed in')
	
	if (typeof data !== 'object')
		throw new HttpsError('invalid-argument', 'You must pass in an object')
	
	const { id, subject, message } = data
	
	if (!(typeof id === 'string' && typeof subject === 'string' && typeof message === 'string'))
		throw new HttpsError(
			'invalid-argument',
			'You must specify an "id", "subject", and "message"'
		)
	
	const [from, to] = await Promise.all([
		User.fromId(auth.uid),
		User.fromId(id)
	])
	
	sendEmail({
		template: EmailTemplate.ContactUser,
		to: {
			name: to.name,
			email: to.email
		},
		replyTo: {
			name: from.name,
			email: from.email
		},
		context: {
			
		}
	})
})
