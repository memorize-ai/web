import { useContext, useEffect, useCallback } from 'react'

import firebase from 'lib/firebase'
import User from 'models/User'
import LoadingState from 'models/LoadingState'
import ContactUserLoadingStateContext from 'contexts/ContactUserLoadingState'
import { setContactUserLoadingState } from 'actions'
import useCurrentUser from './useCurrentUser'

import 'firebase/firestore'

const firestore = firebase.firestore()

const useContactUserLoadingState = (user: User | null): LoadingState => {
	const [loadingStates, dispatch] = useContext(ContactUserLoadingStateContext)
	const [currentUser, currentUserLoadingState] = useCurrentUser()
	
	const userId = user?.id
	const currentUserId = currentUser?.id
	
	const userAllowsContact = user?.allowContact ?? null
	const currentUserIsMuted = currentUser?.isMuted ?? null
	
	const setLoadingState = useCallback((value: LoadingState) => {
		if (!userId)
			return
		
		dispatch(setContactUserLoadingState(userId, value))
	}, [userId, dispatch])
	
	const getLoadingState = useCallback(async () => {
		if (!userId)
			return LoadingState.Loading
		
		if (userId === currentUserId)
			return LoadingState.Fail
		
		if (userAllowsContact === null)
			return LoadingState.Loading
		
		if (!userAllowsContact)
			return LoadingState.Fail
		
		if (currentUserId) {
			if (currentUserIsMuted === null)
				return LoadingState.Loading
			
			if (currentUserIsMuted)
				return LoadingState.Fail
			
			const { exists: isBlocked } = await firestore
				.doc(`users/${userId}/blocked/${currentUserId}`)
				.get()
			
			return isBlocked
				? LoadingState.Fail
				: LoadingState.Success
		}
		
		// Not signed in
		if (currentUserLoadingState === LoadingState.Success)
			return LoadingState.Success
	}, [userId, currentUserId, userAllowsContact, currentUserIsMuted, currentUserLoadingState])
	
	useEffect(() => {
		getLoadingState().then(setLoadingState)
	}, [getLoadingState, setLoadingState])
	
	return (user && loadingStates[user.id]) ?? LoadingState.Loading
}

export default useContactUserLoadingState
