import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

import User from './User'
import Deck from './Deck'
import Email, { EmailType } from './Email'

const firestore = admin.firestore()

export enum PermissionRole {
	none = -1,
	viewer = 0,
	editor = 1,
	admin = 2
}

export enum PermissionStatus {
	declined = -1,
	pending = 0,
	accepted = 1
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

	static status(num: number): PermissionStatus {
		switch (num) {
		case -1:
			return PermissionStatus.declined
		case 1:
			return PermissionStatus.accepted
		default:
			return PermissionStatus.pending
		}
	}

	static didUpgradeRole(from: PermissionRole, to: PermissionRole): boolean {
		return from.valueOf() < to.valueOf()
	}

	static stringify(role: PermissionRole): string {
		switch (role) {
		case PermissionRole.none:
			return 'none'
		case PermissionRole.viewer:
			return 'viewer'
		case PermissionRole.editor:
			return 'editor'
		case PermissionRole.admin:
			return 'admin'
		}
	}

	static verbify(role: PermissionRole): string {
		switch (role) {
		case PermissionRole.none:
			return 'none'
		case PermissionRole.viewer:
			return 'view'
		case PermissionRole.editor:
			return 'edit'
		case PermissionRole.admin:
			return 'administer'
		}
	}

	static isPending(snapshot: FirebaseFirestore.DocumentSnapshot): boolean {
		const status = snapshot.get('status')
		return Permission.status(status === undefined ? 0 : status) === PermissionStatus.pending
	}

	static invitationUrl(uid: string, deckId: string): string {
		return `https://memorize.ai/invites/${uid}/${deckId}`
	}
}

export const permissionCreated = functions.firestore.document('decks/{deckId}/permissions/{uid}').onCreate((snapshot, context) => {
	const date = new Date()
	const role = snapshot.get('role')
	return Promise.all([
		firestore.doc(`users/${context.params.uid}/invites/${context.params.deckId}`).set({ role, date, status: 0 }),
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
		)
	])
})

export const permissionUpdated = functions.firestore.document('decks/{deckId}/permissions/{uid}').onUpdate((change, context) =>
	change.before.get('status') === change.after.get('status')
		? Promise.all([
			User.updateLastActivity(context.auth!.uid),
			Permission.isPending(change.after)
				? firestore.doc(`users/${context.params.uid}/invites/${context.params.deckId}`).update({ role: change.after.get('role') })
				: firestore.doc(`users/${context.auth!.uid}`).get().then(user =>
					firestore.doc(`decks/${context.params.deckId}`).get().then(deck =>
						Deck.image(context.params.deckId).then(image => {
							const after = Permission.role(change.after.get('role'))
							const deckName = deck.get('name')
							const subject = `${user.get('name')} ${Permission.didUpgradeRole(Permission.role(change.before.get('role')), after) ? 'promoted' : 'demoted'} you to a${after === PermissionRole.viewer ? '' : 'n'} ${Permission.stringify(after)} in ${deckName}`
							return Email.send(EmailType.roleChanged, { to: context.params.uid, subject }, {
								deck_image: image,
								deck_name: deckName,
								deck_subtitle: deck.get('subtitle'),
								text: subject,
								deck_url: Deck.url(context.params.deckId)
							})
						})
					)
				) as Promise<FirebaseFirestore.WriteResult>
		])
		: Promise.resolve()
)

export const permissionDeleted = functions.firestore.document('decks/{deckId}/permissions/{uid}').onDelete((snapshot, context) =>
	Promise.all([
		User.updateLastActivity(context.auth!.uid),
		Permission.isPending(snapshot)
			? firestore.doc(`users/${context.params.uid}/invites/${context.params.deckId}`).delete()
			: firestore.doc(`users/${context.auth!.uid}`).get().then(user =>
				firestore.doc(`decks/${context.params.deckId}`).get().then(deck => {
					const userName = user.get('name')
					const deckName = deck.get('name')
					const role = Permission.role(snapshot.get('role'))
					const text = `${userName} removed you as a${role === PermissionRole.viewer ? '' : 'n'} ${Permission.stringify(role)} to ${deckName}`
					return deck.get('public')
						? Deck.image(context.params.deckId).then(image =>
							Email.send(EmailType.uninvited, { to: context.params.uid, subject: text }, {
								deck_image: image,
								deck_name: deckName,
								deck_subtitle: deck.get('subtitle'),
								text,
								deck_url: Deck.url(context.params.deckId)
							})
						)
						: Email.send(EmailType.accessRemoved, { to: context.params.uid, subject: `${userName} removed your access to ${deckName}` }, {
							text,
							deck_name: deckName
						})
				})
			) as Promise<FirebaseFirestore.WriteResult>
	])
)