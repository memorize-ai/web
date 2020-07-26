import { useContext, useEffect, useMemo, useCallback } from 'react'

import firebase from '../firebase'
import User from '../models/User'
import LoadingState from '../models/LoadingState'
import ContactUserLoadingStateContext from '../contexts/ContactUserLoadingState'
import { setContactUserLoadingState } from '../actions'
import useCurrentUser from './useCurrentUser'

import 'firebase/firestore'

const firestore = firebase.firestore()

export default (user: User | null): LoadingState => {
	const [loadingStates, dispatch] = useContext(ContactUserLoadingStateContext)
	
	const [currentUser, currentUserLoadingState] = useCurrentUser()
	
	const setLoadingState = useCallback((value: LoadingState) => {
		if (user)
			dispatch(setContactUserLoadingState(user.id, value))
	}, [user, dispatch])
	
	const getLoadingState = useCallback(async () => {
		if (user) {
			if (user.id === currentUser?.id)
				return LoadingState.Fail
			
			if (user.allowContact === null)
				return LoadingState.Loading
			
			if (!user.allowContact)
				return LoadingState.Fail
			
			if (currentUser) {
				const { exists } = await firestore.doc(`users/${user.id}/blocked/${currentUser.id}`).get()
				return exists ? LoadingState.Fail : LoadingState.Success
			}
			
			// Not signed in
			if (currentUserLoadingState === LoadingState.Success)
				return LoadingState.Success
		}
		
		return LoadingState.Loading
	}, [user, currentUser, currentUserLoadingState])
	
	useEffect(() => {
		getLoadingState().then(setLoadingState)
	}, [getLoadingState, setLoadingState])
	
	return useMemo(() => (
		(user && loadingStates[user.id]) ?? LoadingState.Loading
	), [loadingStates, user])
}
