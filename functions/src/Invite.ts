import * as admin from 'firebase-admin'

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
		this.id = snapshot.get('id')
		this.role = snapshot.get('role')
		this.date = snapshot.get('date')
		this.confirmed = snapshot.get('confirmed')
		this.status = Permission.status(snapshot.get('status'))
		this.sender = snapshot.get('sender')
	}

	static fromId(id: string): Promise<Invite> {
		return firestore.doc(`invites/${id}`).get().then(invite =>
			invite.exists
				? firestore.doc(`users/${invite.get('uid')}/invites/${invite.get('deckId')}`).get().then(inviteSnapshot =>
					new Invite(inviteSnapshot)
				)
				: Promise.reject()
		)
	}
}