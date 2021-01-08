import { useCallback, useEffect } from 'react'
import { useRecoilState } from 'recoil'

import User from 'models/User'
import LoadingState from 'models/LoadingState'
import state from 'state/contactUser'
import firebase from 'lib/firebase'
import useCurrentUser from './useCurrentUser'

import 'firebase/firestore'

const firestore = firebase.firestore()

const useContactUserState = (user: User): LoadingState => {
	const [loadingState, setLoadingState] = useRecoilState(state(user.id))
	const [currentUser, currentUserLoadingState] = useCurrentUser()

	const userId = user.id
	const currentUserId = currentUser?.id

	const userAllowsContact = user.allowContact
	const currentUserIsMuted = currentUser?.isMuted ?? null

	const getLoadingState = useCallback(async () => {
		if (!userId) return LoadingState.Loading

		if (userId === currentUserId) return LoadingState.Fail

		if (userAllowsContact === null) return LoadingState.Loading

		if (!userAllowsContact) return LoadingState.Fail

		if (currentUserId) {
			if (currentUserIsMuted === null) return LoadingState.Loading

			if (currentUserIsMuted) return LoadingState.Fail

			const { exists: isBlocked } = await firestore
				.doc(`users/${userId}/blocked/${currentUserId}`)
				.get()

			return isBlocked ? LoadingState.Fail : LoadingState.Success
		}

		if (currentUserLoadingState === LoadingState.Success)
			// Not signed in
			return LoadingState.Success

		return LoadingState.Loading
	}, [
		userId,
		currentUserId,
		userAllowsContact,
		currentUserIsMuted,
		currentUserLoadingState
	])

	useEffect(() => {
		getLoadingState().then(setLoadingState)
	}, [getLoadingState, setLoadingState])

	return loadingState
}

export default useContactUserState
