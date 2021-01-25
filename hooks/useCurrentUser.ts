import { useEffect } from 'react'
import { useRecoilState } from 'recoil'

import User from 'models/User'
import LoadingState from 'models/LoadingState'
import state from 'state/currentUser'
import firebase from 'lib/firebase'
import { setExpectsSignIn } from 'lib/expectsSignIn'
import identify from 'lib/identify'
import setToken from 'lib/setToken'
import handleError from 'lib/handleError'

import 'firebase/auth'
import 'firebase/firestore'

const auth = firebase.auth()
const firestore = firebase.firestore()

const useCurrentUser = () => {
	const [{ value: currentUser, loadingState }, setState] = useRecoilState(state)

	const id = currentUser?.id
	const notificationsType = currentUser?.notifications?.type

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
		console.log(Boolean(currentUser))
		setExpectsSignIn(Boolean(currentUser))
		if (currentUser) identify(currentUser)
	}, [currentUser, loadingState])

	useEffect(() => {
		if (!id || notificationsType === undefined || notificationsType === 'none')
			return

		console.log(id, notificationsType)
		// setToken(id)
	}, [id, notificationsType])

	return [currentUser, loadingState] as const
}

export default useCurrentUser
