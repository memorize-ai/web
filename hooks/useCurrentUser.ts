import { useEffect } from 'react'
import { useRecoilState } from 'recoil'

import User from 'models/User'
import LoadingState from 'models/LoadingState'
import state from 'state/currentUser'
import firebase from 'lib/firebase'
import { setExpectsSignIn } from 'lib/expectsSignIn'
import { handleError, hubSpotIdentifyUser } from 'lib/utils'

import 'firebase/auth'
import 'firebase/firestore'

const auth = firebase.auth()
const firestore = firebase.firestore()

const useCurrentUser = () => {
	const [
		{ value: currentUser, loadingState, isObserving },
		setState
	] = useRecoilState(state)

	const isLoading = loadingState !== LoadingState.None

	useEffect(() => {
		if (isLoading || User.didInitialize) return

		User.didInitialize = true

		setState(state => ({ ...state, loadingState: LoadingState.Loading }))

		auth.onAuthStateChanged(
			user => {
				setState(state => ({
					...state,
					value: user && User.fromFirebaseUser(user),
					loadingState: LoadingState.Success
				}))

				setExpectsSignIn(Boolean(user))
				if (user) hubSpotIdentifyUser(user)
			},
			error => {
				setState(state => ({
					...state,
					value: null,
					loadingState: LoadingState.Fail
				}))
				handleError(error)
			}
		)
	}, [isLoading, setState])

	useEffect(() => {
		if (!currentUser || currentUser.isObserving || isObserving) return

		currentUser.isObserving = true
		setState(state => ({ ...state, isObserving: true }))

		firestore.doc(`users/${currentUser.id}`).onSnapshot(snapshot => {
			setState(state => ({
				...state,
				value: state.value && state.value.updateFromSnapshot(snapshot)
			}))
		}, handleError)
	}, [currentUser, isObserving, setState])

	return [currentUser, loadingState] as const
}

export default useCurrentUser
