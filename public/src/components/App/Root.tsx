import React from 'react'

import LoadingState from '../../models/LoadingState'
import useCurrentUser from '../../hooks/useCurrentUser'
import Home from '../Home'
import DashboardHome from '../Dashboard/Home'
import { expectsSignIn } from '../../utils'

export default () => {
	const [currentUser, currentUserLoadingState] = useCurrentUser()
	
	return (currentUserLoadingState === LoadingState.Success ? currentUser : expectsSignIn())
		? <DashboardHome />
		: <Home />
}
