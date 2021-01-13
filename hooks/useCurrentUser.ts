import { useEffect } from 'react'
import { useRecoilState } from 'recoil'

import User from 'models/User'
import LoadingState from 'models/LoadingState'
import state from 'state/currentUser'
import firebase from 'lib/firebase'
import { setExpectsSignIn } from 'lib/expectsSignIn'
import identify from 'lib/identify'
import handleError from 'lib/handleError'

import 'firebase/auth'
import 'firebase/firestore'

const auth = firebase.auth()
const firestore = firebase.firestore()

const useCurrentUser = () => {
	const [{ value: currentUser, loadingState }, setState] = useRecoilState(state)

	useEffect(() => {
		if (User.didInitialize) return
		User.didInitialize = true

		auth.onAuthStateChanged(
			user => {
				setState({
					value: user && User.fromFirebaseUser(user),
					loadingState: LoadingState.Success
				})
			},
			error => {
				setState({ value: null, loadingState: LoadingState.Fail })
				handleError(error)
			}
		)
	}, [setState])

	useEffect(() => {
		if (!currentUser || currentUser.isObserving) return
		currentUser.isObserving = true

		firestore.doc(`users/${currentUser.id}`).onSnapshot(snapshot => {
			setState(({ value, loadingState }) => ({
				value: value && value.updateFromSnapshot(snapshot),
				loadingState
			}))
		}, handleError)
	}, [currentUser, setState])

	useEffect(() => {
		if (loadingState === LoadingState.Loading) return

		setExpectsSignIn(Boolean(currentUser))
		if (currentUser) identify(currentUser)
	}, [currentUser, loadingState])

	return [currentUser, loadingState] as const
}

export default useCurrentUser
