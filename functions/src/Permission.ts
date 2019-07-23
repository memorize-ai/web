import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

import User from './User'
import Deck from './Deck'
import Email, { EmailType } from './Email'
import Invite from './Invite'

const firestore = admin.firestore()

export enum PermissionRole {
	none = -1,
	viewer = 0,
	editor = 1,
	admin = 2,
	owner = 3
}

export enum PermissionStatus {
	declined = -1,
	pending = 0,
	accepted = 1
}

export default class Permission {
	static get(uid: string, deckId: string): Promise<{ role: PermissionRole, confirmed: boolean, status: PermissionStatus }> {
		return Deck.doc(deckId, `permissions/${uid}`).get().then(permission => ({
			role: Permission.role(permission.get('role')),
			confirmed: permission.get('confirmed') !== undefined,
			status: Permission.status(permission.get('status') || 0)
		}))
	}

	static role(str: string | undefined): PermissionRole {
		switch (str) {
		case 'viewer':
			return PermissionRole.viewer
		case 'editor':
			return PermissionRole.editor
		case 'admin':
			return PermissionRole.admin
		case 'owner':
			return PermissionRole.owner
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
		case PermissionRole.owner:
			return 'owner'
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
		case PermissionRole.owner:
			return 'own'
		}
	}

	static isPending(snapshot: FirebaseFirestore.DocumentSnapshot): boolean {
		const status: number = snapshot.get('status')
		return Permission.status(status === undefined ? 0 : status) === PermissionStatus.pending
	}

	static isDeclined(snapshot: FirebaseFirestore.DocumentSnapshot): boolean {
		const status: number = snapshot.get('status')
		return Permission.status(status === undefined ? -1 : status) === PermissionStatus.declined
	}
}

export const permissionCreated = functions.firestore.document('decks/{deckId}/permissions/{uid}').onCreate((snapshot, context) => {
	const role: string = snapshot.get('role')
	const inviteId = Invite.newId()
	return Promise.all([
		firestore.doc(`users/${context.params.uid}/invites/${context.params.deckId}`).set({ id: inviteId, role, date: snapshot.get('date'), status: 0, sent: snapshot.get('sent') }),
		context.auth
			? Promise.all([
				User.updateLastActivity(context.auth.uid),
				firestore.doc(`users/${context.auth.uid}`).get().then(user =>
					Deck.doc(context.params.deckId).get().then(deck =>
						Deck.image(context.params.deckId).then(image => {
							const deckName: string = deck.get('name')
							const subject = `${user.get('name')} invited you to ${Permission.verbify(Permission.role(role))} ${deckName}`
							return Email.send(EmailType.invited, { to: context.params.uid, subject }, {
								deck_image: image,
								deck_name: deckName,
								deck_subtitle: deck.get('subtitle'),
								text: subject,
								action_url: Invite.url(inviteId),
								deck_url: Deck.url(context.params.deckId)
							})
						})
					)
				)
			])
			: Promise.resolve() as Promise<any>
	])
})

export const permissionUpdated = functions.firestore.document('decks/{deckId}/permissions/{uid}').onUpdate((change, context) => {
	const role: string = change.after.get('role')
	return change.before.get('status') === change.after.get('status') && change.before.get('confirmed').isEqual(change.after.get('confirmed'))
		? Promise.all([
			context.auth ? User.updateLastActivity(context.auth.uid) : Promise.resolve(),
			User.updateRoleForDeck(context.params.uid, context.params.deckId, Permission.role(role)),
			Permission.isPending(change.after)
				? firestore.doc(`users/${context.params.uid}/invites/${context.params.deckId}`).update({ role })
				: context.auth
					? firestore.doc(`users/${context.auth.uid}`).get().then(user =>
						Deck.doc(context.params.deckId).get().then(deck =>
							Deck.image(context.params.deckId).then(image => {
								const after = Permission.role(role)
								const deckName = deck.get('name')
								const subject = `${user.get('name')} ${Permission.didUpgradeRole(Permission.role(change.before.get('role')), after) ? 'promoted' : 'demoted'} you to a${after === PermissionRole.viewer ? '' : 'n'} ${Permission.stringify(after)} of ${deckName}`
								return Email.send(EmailType.roleChanged, { to: context.params.uid, subject }, {
									deck_image: image,
									deck_name: deckName,
									deck_subtitle: deck.get('subtitle'),
									text: subject,
									deck_url: Deck.url(context.params.deckId)
								})
							})
						)
					)
					: Promise.resolve() as Promise<any>
		])
		: Permission.status(change.after.get('status')) === PermissionStatus.accepted
			? User.addDeck(context.params.uid, context.params.deckId, Permission.role(role))
			: Promise.resolve()
})

export const permissionDeleted = functions.firestore.document('decks/{deckId}/permissions/{uid}').onDelete((snapshot, context) =>
	Promise.all([
		context.auth ? User.updateLastActivity(context.auth.uid) : Promise.resolve(),
		User.updateRoleForDeck(context.params.uid, context.params.deckId, PermissionRole.none),
		Permission.isPending(snapshot)
			? firestore.doc(`users/${context.params.uid}/invites/${context.params.deckId}`).delete()
			: Permission.isDeclined(snapshot)
				? Promise.resolve() as Promise<any>
				: context.auth
					? firestore.doc(`users/${context.auth.uid}`).get().then(user =>
						Deck.doc(context.params.deckId).get().then(deck => {
							const userName: string = user.get('name')
							const deckName: string = deck.get('name')
							const role = Permission.role(snapshot.get('role'))
							const text = `${userName} removed you as a${role === PermissionRole.viewer ? '' : 'n'} ${Permission.stringify(role)} of ${deckName}`
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
					)
					: Promise.resolve()
	])
)