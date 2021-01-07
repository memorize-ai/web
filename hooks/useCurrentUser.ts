import { useContext, useEffect } from 'react'

import CurrentUserContext from 'contexts/CurrentUser'
import User from 'models/User'
import LoadingState from 'models/LoadingState'
import {
	setCurrentUser,
	updateCurrentUser,
	setCurrentUserLoadingState,
	setIsObservingCurrentUser
} from 'actions'
import { compose } from 'lib/utils'

const useCurrentUser = () => {
	const [
		{ currentUser, currentUserLoadingState, isObservingCurrentUser },
		dispatch
	] = useContext(CurrentUserContext)

	useEffect(() => {
		if (currentUserLoadingState !== LoadingState.None || User.didInitialize)
			return

		User.didInitialize = true
		User.initialize({
			setCurrentUser: compose(dispatch, setCurrentUser),
			setCurrentUserLoadingState: compose(dispatch, setCurrentUserLoadingState)
		})
	}, [currentUserLoadingState, dispatch])

	useEffect(() => {
		if (!currentUser || isObservingCurrentUser || currentUser.isObserving)
			return

		currentUser.isObserving = true
		currentUser.observe({
			updateCurrentUser: compose(dispatch, updateCurrentUser),
			setIsObservingCurrentUser: compose(dispatch, setIsObservingCurrentUser)
		})
	}, [currentUser, isObservingCurrentUser, dispatch])

	return [currentUser, currentUserLoadingState] as const
}

export default useCurrentUser
