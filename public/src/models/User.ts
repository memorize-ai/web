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
		
		return this
	}
}
