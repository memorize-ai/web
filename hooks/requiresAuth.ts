import { useEffect } from 'react'
import Router from 'next/router'

import useAuthState from './useAuthState'

const requiresAuth = (assertion = true) => {
	const isSignedIn = useAuthState()

	useEffect(() => {
		if (isSignedIn === false && assertion)
			Router.replace({
				pathname: '/',
				query: {
					next: `${window.location.pathname}${window.location.search}`
				}
			})
	}, [isSignedIn, assertion])
}

export default requiresAuth
