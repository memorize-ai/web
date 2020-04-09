import { useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import useCurrentUser from './useCurrentUser'
import LoadingState from '../models/LoadingState'
import { expectsSignIn } from '../utils'
import { urlForAuth } from '../components/Auth'

export default (next: string | null = null) => {
	const history = useHistory()
	const [currentUser, currentUserLoadingState] = useCurrentUser()
	
	useEffect(() => {
		if (currentUserLoadingState === LoadingState.Success ? currentUser : expectsSignIn())
			return
		
		history.push(urlForAuth({ next }))
	}, [currentUser, currentUserLoadingState]) // eslint-disable-line
}
