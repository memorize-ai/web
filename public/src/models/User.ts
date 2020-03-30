import firebase from '../firebase'
import LoadingState from './LoadingState'
import { setExpectsSignIn } from '../utils'

import 'firebase/auth'
import 'firebase/firestore'

const auth = firebase.auth()
const firestore = firebase.firestore()

export default class User {
	id: string
	name: string | null
	email: string | null
	
	numberOfDecks: number | null = null
	xp: number | null = null
	interestIds: string[] | null = null
	allDecks: string[] | null = null
	
	constructor(firebaseUser: firebase.User) {
		this.id = firebaseUser.uid
		this.name = firebaseUser.displayName
		this.email = firebaseUser.email
	}
	
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
				alert(error.message)
				console.error(error)
			}
		)
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
	
	observe = (
		{ updateCurrentUser, setIsObservingCurrentUser }: {
			updateCurrentUser: (snapshot: firebase.firestore.DocumentSnapshot) => void
			setIsObservingCurrentUser: (value: boolean) => void
		}
	) => {
		setIsObservingCurrentUser(true)
		
		firestore.doc(`users/${this.id}`).onSnapshot(
			updateCurrentUser,
			error => {
				alert(error.message)
				console.error(error)
			}
		)
		
		return this
	}
	
	updateFromSnapshot = (snapshot: firebase.firestore.DocumentSnapshot) => {
		this.name = snapshot.get('name')
		this.email = snapshot.get('email')
		
		this.numberOfDecks = snapshot.get('deckCount') ?? 0
		this.xp = snapshot.get('xp') ?? 0
		this.interestIds = snapshot.get('topics') ?? []
		this.allDecks = snapshot.get('allDecks') ?? []
		
		return this
	}
	
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
