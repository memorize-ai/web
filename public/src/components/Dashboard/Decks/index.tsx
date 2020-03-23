import React from 'react'

import Dashboard, { DashboardTabSelection as Selection } from '..'
import requiresAuth from '../../../hooks/requiresAuth'

export default () => {
	requiresAuth('/decks')
	
	return (
		<Dashboard selection={Selection.Decks} className="decks">
			Decks
		</Dashboard>
	)
}
