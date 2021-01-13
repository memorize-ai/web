import { useEffect } from 'react'
import Router from 'next/router'

import useAuthState from './useAuthState'

const requiresAuth = (assertion = true) => {
	const isSignedIn = useAuthState()

	useEffect(() => {
		if (isSignedIn || !assertion) return
		Router.replace('/')
	}, [isSignedIn, assertion])
}

export default requiresAuth
