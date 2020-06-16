import firebase from '../firebase'
import LoadingState from './LoadingState'
import { setExpectsSignIn, handleError } from '../utils'

import 'firebase/auth'
import 'firebase/firestore'

const auth = firebase.auth()
const firestore = firebase.firestore()

export interface UserData {
	name: string | null
	email: string | null
	apiKey: string | null
	numberOfDecks: number | null
	xp: number | null
	interestIds: string[] | null
	allDecks: string[] | null
}

export default class User implements UserData {
	static creatorObservers: Record<string, boolean> = {}
	
	id: string
	name: string | null
	email: string | null
	apiKey: string | null
	
	numberOfDecks: number | null
	xp: number | null
	interestIds: string[] | null
	allDecks: string[] | null
	
	constructor(id: string, data: UserData) {
		this.id = id
		this.name = data.name
		this.email = data.email
		this.apiKey = data.apiKey
		this.numberOfDecks = data.numberOfDecks
		this.xp = data.xp
		this.interestIds = data.interestIds
		this.allDecks = data.allDecks
	}
	
	static fromFirebaseUser = (user: firebase.User) =>
		new User(user.uid, {
			name: user.displayName,
			email: user.email,
			apiKey: null,
			numberOfDecks: null,
			xp: null,
			interestIds: null,
			allDecks: null
		})
	
	static fromSnapshot = (snapshot: firebase.firestore.DocumentSnapshot) =>
		new User(snapshot.id, {
			name: snapshot.get('name') ?? '(error)',
			email: snapshot.get('email') ?? '(error)',
			apiKey: snapshot.get('apiKey') ?? null,
			numberOfDecks: snapshot.get('deckCount') ?? 0,
			xp: snapshot.get('xp') ?? 0,
			interestIds: snapshot.get('topics') ?? [],
			allDecks: snapshot.get('allDecks') ?? []
		})
	
	static initialize = (
		{ setCurrentUser, setCurrentUserLoadingState }: {
			setCurrentUser: (user: firebase.User | null) => void
			setCurrentUserLoadingState: (loadingState: LoadingState) => void
		}
	) => {
		setCurrentUserLoadingState(LoadingState.Loading)
		
		auth.onAuthStateChanged(
			user => {
				setCurrentUser(user)
				setCurrentUserLoadingState(LoadingState.Success)
				
				setExpectsSignIn(Boolean(user))
			},
			error => {
				setCurrentUserLoadingState(LoadingState.Fail)
				handleError(error)
			}
		)
	}
	
	static loadCreatorForDeckWithId = (
		uid: string,
		{ updateCreator, removeCreator }: {
			updateCreator: (uid: string, snapshot: firebase.firestore.DocumentSnapshot) => void
			removeCreator: (uid: string) => void
		}
	) =>
		firestore.doc(`users/${uid}`).onSnapshot(
			snapshot =>
				snapshot.exists
					? updateCreator(uid, snapshot)
					: removeCreator(uid),
			handleError
		)
	
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
		for (let level = 1;; level++)
			if (xp < User.xpNeededForLevel(level))
				return level - 1
	}
	
	get level() {
		return this.xp === null ? null : User.levelForXP(this.xp ?? 0)
	}
	
	get percentToNextLevel() {
		if (this.xp === null || this.level === null)
			return null
		
		const xpNeededForCurrentLevel = User.xpNeededForLevel(this.level)
		
		return (
			(this.xp - xpNeededForCurrentLevel) /
			(User.xpNeededForLevel(this.level + 1) - xpNeededForCurrentLevel)
		)
	}
	
	get xpBadge() {
		return `https://memorize.ai/badges/xp/${this.id}`
	}
	
	observe = (
		{ updateCurrentUser, setIsObservingCurrentUser }: {
			updateCurrentUser: (snapshot: firebase.firestore.DocumentSnapshot) => void
			setIsObservingCurrentUser: (value: boolean) => void
		}
	) => {
		setIsObservingCurrentUser(true)
		
		firestore.doc(`users/${this.id}`).onSnapshot(
			updateCurrentUser,
			handleError
		)
		
		return this
	}
	
	updateFromSnapshot = (snapshot: firebase.firestore.DocumentSnapshot) => {
		this.name = snapshot.get('name')
		this.email = snapshot.get('email')
		this.apiKey = snapshot.get('apiKey') ?? null
		
		this.numberOfDecks = snapshot.get('deckCount') ?? 0
		this.xp = snapshot.get('xp') ?? 0
		this.interestIds = snapshot.get('topics') ?? []
		this.allDecks = snapshot.get('allDecks') ?? []
		
		return this
	}
	
	updateName = (name: string) =>
		firestore.doc(`users/${this.id}`).update({ name })
	
	toggleInterest = (id: string) => {
		if (!this.interestIds)
			return this
		
		firestore.doc(`users/${this.id}`).update({
			topics: this.interestIds.includes(id)
				? firebase.firestore.FieldValue.arrayRemove(id)
				: firebase.firestore.FieldValue.arrayUnion(id)
		})
		
		return this
	}
}
