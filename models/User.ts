import SnapshotLike from './SnapshotLike'
import firebase from 'lib/firebase'

import 'firebase/auth'
import 'firebase/firestore'

const auth = firebase.auth()
const firestore = firebase.firestore()

export interface UserData {
	id: string
	name: string | null
	email: string | null
	contact: boolean | null
	muted: boolean | null
	apiKey: string | null
	decks: number | null
	xp: number | null
	interests: string[] | null
	allDecks: string[] | null
}

export default class User {
	static didInitialize = false
	static creatorObservers: Record<string, boolean> = {}

	isObserving = false

	id: string
	name: string | null
	email: string | null
	allowContact: boolean | null
	isMuted: boolean | null
	apiKey: string | null

	numberOfDecks: number | null
	xp: number | null
	interestIds: string[] | null
	allDecks: string[] | null

	constructor(data: UserData) {
		this.id = data.id
		this.name = data.name
		this.email = data.email
		this.allowContact = data.contact
		this.isMuted = data.muted
		this.apiKey = data.apiKey
		this.numberOfDecks = data.decks
		this.xp = data.xp
		this.interestIds = data.interests
		this.allDecks = data.allDecks
	}

	static fromFirebaseUser = (user: firebase.User) =>
		new User({
			id: user.uid,
			name: user.displayName,
			email: user.email,
			contact: null,
			muted: null,
			apiKey: null,
			decks: null,
			xp: null,
			interests: null,
			allDecks: null
		})

	static fromSnapshot = (snapshot: SnapshotLike) =>
		new User(User.dataFromSnapshot(snapshot))

	static dataFromSnapshot = (
		snapshot: SnapshotLike,
		fromServer = false
	): UserData => ({
		id: snapshot.id,
		name: snapshot.get('name') ?? '(error)',
		email: fromServer ? null : snapshot.get('email') ?? '(error)',
		contact: snapshot.get('allowContact') ?? true,
		muted: snapshot.get('muted') ?? false,
		apiKey: fromServer ? null : snapshot.get('apiKey') ?? null,
		decks: snapshot.get('deckCount') ?? 0,
		xp: snapshot.get('xp') ?? 0,
		interests: snapshot.get('topics') ?? [],
		allDecks: fromServer ? null : snapshot.get('allDecks') ?? []
	})

	static xpNeededForLevel = (level: number): number => {
		switch (level) {
			case 0:
				return 0
			case 1:
				return 1
			case 2:
				return 5
			case 3:
				return 10
			case 4:
				return 50
			default:
				return User.xpNeededForLevel(level - 1) + 25 * (level - 4)
		}
	}

	static levelForXP = (xp: number) => {
		for (let level = 1; ; level++)
			if (xp < User.xpNeededForLevel(level)) return level - 1
	}

	get level() {
		return this.xp === null ? null : User.levelForXP(this.xp ?? 0)
	}

	get percentToNextLevel() {
		if (this.xp === null || this.level === null) return null

		const xpNeededForCurrentLevel = User.xpNeededForLevel(this.level)

		return (
			(this.xp - xpNeededForCurrentLevel) /
			(User.xpNeededForLevel(this.level + 1) - xpNeededForCurrentLevel)
		)
	}

	updateFromSnapshot = (snapshot: firebase.firestore.DocumentSnapshot) => {
		this.name = snapshot.get('name')
		this.email = snapshot.get('email')
		this.allowContact = snapshot.get('allowContact') ?? true
		this.isMuted = snapshot.get('muted') ?? false
		this.apiKey = snapshot.get('apiKey') ?? null

		this.numberOfDecks = snapshot.get('deckCount') ?? 0
		this.xp = snapshot.get('xp') ?? 0
		this.interestIds = snapshot.get('topics') ?? []
		this.allDecks = snapshot.get('allDecks') ?? []

		return this
	}

	updateName = (name: string) =>
		Promise.all(
			[
				firestore.doc(`users/${this.id}`).update({ name }),
				auth.currentUser?.updateProfile({ displayName: name })
			].filter(Boolean)
		)

	toggleInterest = (id: string) => {
		if (!this.interestIds) return this

		firestore.doc(`users/${this.id}`).update({
			topics: this.interestIds.includes(id)
				? firebase.firestore.FieldValue.arrayRemove(id)
				: firebase.firestore.FieldValue.arrayUnion(id)
		})

		return this
	}
}
