import { https } from 'firebase-functions'

import User from '../../User'
import { sendEmail, EmailTemplate } from '../../Email'

const { onCall, HttpsError } = https

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
	
	await sendEmail({
		template: EmailTemplate.ContactUser,
		to: to.emailUser,
		replyTo: from.emailUser,
		context: {
			subject,
			body,
			from_name: from.name,
			to_name: to.name,
			block_url: `https://memorize.ai/block/${to.id}/${from.id}`,
			restrict_contact_url: `https://memorize.ai/restrict-contact/${to.id}`
		}
	})
})
