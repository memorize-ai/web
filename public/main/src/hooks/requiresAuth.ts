import { useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'

import useAuthState from './useAuthState'
import { urlWithQuery } from '../utils'

export default (assertion: boolean = true) => {
	const history = useHistory()
	const location = useLocation()
	const isSignedIn = useAuthState()
	
	useEffect(() => {
		if (isSignedIn || !assertion)
			return
		
		history.push(urlWithQuery('/', {
			next: `${location.pathname}${location.search}`
		}))
	}, [isSignedIn, assertion, history, location])
}
