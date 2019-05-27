import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

import User from './User'
import Deck from './Deck'
import Email, { EmailType } from './Email'

const firestore = admin.firestore()

export enum PermissionRole {
	none = 'none',
	viewer = 'viewer',
	editor = 'editor',
	admin = 'admin'
}

export default class Permission {
	static get(uid: string, deckId: string): Promise<PermissionRole> {
		return Deck.doc(deckId, `permissions/${uid}`).get().then(permission =>
			Permission.role(permission.get('role') || 'none')
		)
	}

	static role(str: string): PermissionRole {
		switch (str) {
		case 'viewer':
			return PermissionRole.viewer
		case 'editor':
			return PermissionRole.editor
		default:
			return PermissionRole.none
		}
	}

	static verbify(role: PermissionRole): string {
		switch (role) {
		case PermissionRole.viewer:
			return 'view'
		case PermissionRole.editor:
			return 'edit'
		case PermissionRole.admin:
			return 'administer'
		default:
			return role.valueOf()
		}
	}

	static invitationUrl(uid: string, deckId: string): string {
		return `https://memorize.ai/invites/${uid}/${deckId}`
	}
}

export const permissionCreated = functions.firestore.document('decks/{deckId}/permissions/{uid}').onCreate((snapshot, context) => {
	const date = new Date()
	const role = snapshot.get('role')
	return Promise.all([
		firestore.doc(`users/${context.params.uid}/invites/${context.params.deckId}`).set({ role, date }),
		User.updateLastActivity(context.auth!.uid),
		firestore.doc(`users/${context.auth!.uid}`).get().then(user =>
			firestore.doc(`decks/${context.params.deckId}`).get().then(deck =>
				Deck.image(context.params.deckId).then(image => {
					const deckName = deck.get('name')
					const subject = `${user.get('name')} invited you to ${Permission.verbify(role)} ${deckName}`
					return Email.send(EmailType.invitation, { to: context.params.uid, subject }, {
						deck_image: image,
						deck_name: deckName,
						deck_subtitle: deck.get('subtitle'),
						text: subject,
						action_url: Permission.invitationUrl(context.params.uid, context.params.deckId),
						deck_url: Deck.url(context.params.deckId)
					})
				})
			)
		) // TODO: Also send notification
	])
})

export const permissionUpdated = functions.firestore.document('decks/{deckId}/permissions/{uid}').onUpdate((_change, context) =>
	Promise.all([
		User.updateLastActivity(context.auth!.uid),
		Email.send()
	])
)

export const permissionDeleted = functions.firestore.document('decks/{deckId}/permissions/{uid}').onDelete((_snapshot, context) =>
	Promise.all([
		firestore.doc(`users/${context.params.uid}/invites/${context.params.deckId}`).delete(),
		User.updateLastActivity(context.auth!.uid),
		Email.send()
	])
)