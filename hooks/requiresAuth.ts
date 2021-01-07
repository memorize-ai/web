import { useEffect } from 'react'
import Router from 'next/router'

import useAuthState from './useAuthState'

const requiresAuth = (assertion = true) => {
	const isSignedIn = useAuthState()

	useEffect(() => {
		if (isSignedIn || !assertion) return

		Router.replace({
			pathname: '/',
			query: {
				next: `${window.location.pathname}${window.location.search}`
			}
		})
	}, [isSignedIn, assertion])
}

export default requiresAuth
