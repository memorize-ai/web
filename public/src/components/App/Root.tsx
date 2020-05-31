import React, { memo } from 'react'

import useAuthState from '../../hooks/useAuthState'
import Home from '../Home'
import DashboardHome from '../Dashboard/Home'

const Root = memo(() => (
	useAuthState() ? <DashboardHome /> : <Home />
))

export default Root
