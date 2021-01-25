import { nanoid } from 'nanoid'

import Data from './Data'
import Notifications, { DEFAULT_USER_NOTIFICATIONS } from './Notifications'
import CreateOptions from './CreateOptions'
import SnapshotLike from '../SnapshotLike'
import firebase from 'lib/firebase'
import identify from 'lib/identify'
import setToken from 'lib/setToken'
import slugify from 'lib/slugify'

import 'firebase/firestore'

const { FieldValue } = firebase.firestore
const firestore = firebase.firestore()

export default class User {
	static readonly SLUG_ID_LENGTH = 10

	static didInitialize = false
	static readonly creatorObservers = new Set<string>()

	isObserving = false

	id: string
	hasImage: boolean | null
	slugId: string | null
	slug: string | null
	name: string | null
	email: string | null
	bio: string | null
	allowContact: boolean | null
	isMuted: boolean | null
	apiKey: string | null

	numberOfDecks: number | null
	numberOfCreatedDecks: number | null
	xp: number | null
	interestIds: string[] | null
	allDecks: string[] | null
	notifications: Notifications | null

	constructor(data: Data, public readonly isCurrent = false) {
		this.id = data.id
		this.hasImage = data.image
		this.slugId = data.slugId
		this.slug = data.slug
		this.name = data.name
		this.email = data.email
		this.bio = data.bio
		this.allowContact = data.contact
		this.isMuted = data.muted
		this.apiKey = data.apiKey
		this.numberOfDecks = data.decks
		this.numberOfCreatedDecks = data.createdDecks
		this.xp = data.xp
		this.interestIds = data.interests
		this.allDecks = data.allDecks
		this.notifications = data.notifications
	}

	static fromFirebaseUser = (user: firebase.User) => {
		const id = user.uid
		const name = user.displayName
		const email = user.email

		if (name && email) identify({ id, name, email })

		return new User(
			{
				id,
				image: null,
				slugId: null,
				slug: null,
				name,
				email,
				bio: null,
				contact: null,
				muted: null,
				apiKey: null,
				decks: null,
				createdDecks: null,
				xp: null,
				interests: null,
				allDecks: null,
				notifications: null
			},
			true
		)
	}

	static fromSnapshot = (snapshot: SnapshotLike) =>
		new User(User.dataFromSnapshot(snapshot))

	static dataFromSnapshot = (
		snapshot: SnapshotLike,
		fromServer = false
	): Data => ({
		id: snapshot.id,
		image: snapshot.get('hasImage') ?? false,
		slugId: snapshot.get('slugId') ?? null,
		slug: snapshot.get('slug') ?? null,
		name: snapshot.get('name') ?? '(error)',
		email: fromServer ? null : snapshot.get('email') ?? '(error)',
		bio: snapshot.get('bio') ?? '',
		contact: snapshot.get('allowContact') ?? true,
		muted: snapshot.get('muted') ?? false,
		apiKey: fromServer ? null : snapshot.get('apiKey') ?? null,
		decks: snapshot.get('deckCount') ?? 0,
		createdDecks: snapshot.get('createdDeckCount') ?? 0,
		xp: snapshot.get('xp') ?? 0,
		interests: snapshot.get('topics') ?? [],
		allDecks: fromServer ? null : snapshot.get('allDecks') ?? [],
		notifications: fromServer
			? null
			: snapshot.get('notifications') ?? DEFAULT_USER_NOTIFICATIONS
	})

	static create = async ({ id, name, email, method, xp }: CreateOptions) => {
		await firestore.doc(`users/${id}`).set({
			slugId: nanoid(User.SLUG_ID_LENGTH),
			slug: slugify(name),
			name,
			email,
			bio: '',
			source: 'web',
			method,
			xp,
			joined: FieldValue.serverTimestamp()
		})
	}

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

	get imageUrl() {
		return this.hasImage
			? `https://firebasestorage.googleapis.com/v0/b/memorize-ai.appspot.com/o/users%2F${this.id}?alt=media`
			: null
	}

	updateFromSnapshot = (snapshot: firebase.firestore.DocumentSnapshot) => {
		const newName: string = snapshot.get('name')
		const newEmail: string = snapshot.get('email')

		if (this.isCurrent && !(this.name === newName && this.email === newEmail))
			identify({ id: this.id, name: newName, email: newEmail })

		this.slugId = snapshot.get('slugId') ?? null
		this.slug = snapshot.get('slug') ?? null

		this.hasImage = snapshot.get('hasImage') ?? false
		this.name = newName
		this.email = newEmail
		this.allowContact = snapshot.get('allowContact') ?? true
		this.isMuted = snapshot.get('muted') ?? false
		this.apiKey = snapshot.get('apiKey') ?? null

		this.numberOfDecks = snapshot.get('deckCount') ?? 0
		this.xp = snapshot.get('xp') ?? 0
		this.interestIds = snapshot.get('topics') ?? []
		this.allDecks = snapshot.get('allDecks') ?? []

		const newNotifications: Notifications =
			snapshot.get('notifications') ?? DEFAULT_USER_NOTIFICATIONS

		newNotifications.type ??= DEFAULT_USER_NOTIFICATIONS.type
		newNotifications.fixed ??= DEFAULT_USER_NOTIFICATIONS.fixed
		newNotifications.fixed.days ??= DEFAULT_USER_NOTIFICATIONS.fixed.days
		newNotifications.fixed.time ??= DEFAULT_USER_NOTIFICATIONS.fixed.time

		const shouldSetToken =
			this.isCurrent &&
			!(
				this.notifications?.type === newNotifications.type ||
				newNotifications.type === 'none'
			)

		if (shouldSetToken) setToken(this.id)
		this.notifications = newNotifications

		return this
	}

	updateName = (name: string) =>
		firestore.doc(`users/${this.id}`).update({ name })

	toggleInterest = (id: string) => {
		if (!this.interestIds) return this

		firestore.doc(`users/${this.id}`).update({
			topics: this.interestIds.includes(id)
				? FieldValue.arrayRemove(id)
				: FieldValue.arrayUnion(id)
		})

		return this
	}

	get uploadUrl() {
		return `/_api/upload-user-asset?user=${this.id}`
	}
}
