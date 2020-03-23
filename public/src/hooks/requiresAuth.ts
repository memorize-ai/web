import { useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import useCurrentUser from './useCurrentUser'
import LoadingState from '../models/LoadingState'
import { expectsSignIn, urlWithSearchParams } from '../utils'

export default (next: string) => {
	const history = useHistory()
	const [currentUser, currentUserLoadingState] = useCurrentUser()
	
	useEffect(() => {
		if (currentUserLoadingState === LoadingState.Success ? currentUser : expectsSignIn())
			return
		
		history.push(urlWithSearchParams('/auth', { next }))
	}, [currentUser, currentUserLoadingState])
}
