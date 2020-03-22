import React from 'react'

import useDecks from '../../hooks/useDecks'
import Row from './SidebarRow'

import '../../scss/components/Dashboard/Sidebar.scss'

export default () => (
	<div className="sidebar">
		<h2>memorize.ai</h2>
		<div className="decks">
			{useDecks().map(deck => (
				<Row key={deck.id} deck={deck} />
			))}
		</div>
	</div>
)
