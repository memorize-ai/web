import React from 'react'

import useAuthState from '../../hooks/useAuthState'
import Home from '../Home'
import DashboardHome from '../Dashboard/Home'

export default () =>
	useAuthState() ? <DashboardHome /> : <Home />
