import React, { lazy, memo } from 'react'

import Dashboard, { DashboardNavbarSelection as Selection } from '..'

export interface CardDraft {
	id: string
	front: string
	back: string
}

const Content = lazy(() => import('./Content'))

const AddCards = () => (
	<Dashboard selection={Selection.Decks} className="add-cards">
		<Content />
	</Dashboard>
)

export default AddCards
