import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as secure from 'securejs'

import { getDate } from './Helpers'
import Email, { EmailType } from './Email'
import Deck from './Deck'
import User from './User'
import Permission, { PermissionRole, PermissionStatus } from './Permission'

const firestore = admin.firestore()

export default class Invite {
	id: string
	role: PermissionRole
	date: Date
	confirmed?: Date
	status: PermissionStatus
	sender: string

	constructor(snapshot: FirebaseFirestore.DocumentSnapshot) {
		this.id = snapshot.get('id') || ''
		this.role = Permission.role(snapshot.get('role'))
		this.date = getDate(snapshot, 'date') || new Date
		this.confirmed = getDate(snapshot, 'confirmed')
		this.status = Permission.status(snapshot.get('status'))
		this.sender = snapshot.get('sender') || ''
	}

	static fromId(id: string): Promise<Invite> {
		return firestore.doc(`invites/${id}`).get().then(invite =>
			invite.exists
				? firestore.doc(`users/${invite.get('uid') || ''}/invites/${invite.get('deckId') || ''}`).get().then(inviteSnapshot =>
					new Invite(inviteSnapshot)
				)
				: Promise.reject()
		)
	}

	static newId(): string {
		return secure.newId(32)
	}

	static url(id: string): string {
		return `https://memorize.ai/i/${id}`
	}
}

export const confirmInvite = functions.https.onCall((data, context) => {
	if (context.auth && data.deckId && data.accept !== undefined) {
		const uid = context.auth.uid
		const doc = firestore.doc(`users/${uid}/invites/${data.deckId}`)
		const statusUpdate = { status: data.accept ? 1 : -1, confirmed: new Date }
		return doc.get().then(invite =>
			invite.exists && Permission.isPending(invite)
				? Promise.all([
					doc.update(statusUpdate),
					Deck.doc(data.deckId, `permissions/${uid}`).update(statusUpdate),
					User.updateLastActivity(uid),
					firestore.doc(`users/${uid}`).get().then(user =>
						firestore.doc(`users/${invite.get('sender') || ''}`).get().then(sender =>
							Deck.doc(data.deckId).get().then(deck =>
								Deck.image(data.deckId).then(image => {
									const confirmationType = data.accept ? 'accepted' : 'declined'
									const role = Permission.verbify(Permission.role(invite.get('role')))
									const userName: string | undefined = user.get('name')
									const senderName: string | undefined = sender.get('name')
									const deckName: string | undefined = deck.get('name')
									const deckSubtitle: string | undefined = deck.get('subtitle')
									const deckUrl = Deck.url(data.deckId)
									return Promise.all([
										Email.send(EmailType.youConfirmedInvite, { to: uid, subject: `You ${confirmationType} ${senderName}'s invite to ${role} ${deckName}` }, {
											deck_image: image,
											deck_name: deckName,
											deck_subtitle: deckSubtitle,
											confirmation_type: confirmationType,
											user_name: senderName,
											role,
											deck_url: deckUrl
										}),
										Email.send(EmailType.inviteConfirmed, { to: sender.id, subject: `${userName} ${confirmationType} your invite to ${role} ${deckName}` }, {
											deck_image: image,
											deck_name: deckName,
											deck_subtitle: deckSubtitle,
											user_name: userName,
											confirmation_type: confirmationType,
											role,
											deck_url: deckUrl
										})
									])
								})
							)
						)
					)
				])
				: new functions.https.HttpsError('not-found', 'Invalid invite') as any
		)
	} else return new functions.https.HttpsError('unauthenticated', 'You must be signed in and pass in a deckId and accept')
})