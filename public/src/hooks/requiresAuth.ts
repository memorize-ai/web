import { useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import useAuthState from './useAuthState'
import { urlWithQuery } from '../utils'

export default (next: string | null = null) => {
	const history = useHistory()
	const isSignedIn = useAuthState()
	
	useEffect(() => {
		if (isSignedIn)
			return
		
		history.push(urlWithQuery('/', {
			next: next ?? `${window.location.pathname}${window.location.search}`
		}))
	}, [isSignedIn, next]) // eslint-disable-line
}
