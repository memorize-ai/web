import React from 'react'

import { DashboardTabSelection as Selection } from '.'
import Item from './TabItem'

import '../../scss/components/Dashboard/Tabs.scss'

export default ({ selection }: { selection: Selection }) => (
	<div className="tabs">
		<Item
			href="/"
			icon=""
			title="Home"
			isSelected={selection === Selection.Home}
		/>
		<Item
			href="/market"
			icon=""
			title="Market"
			isSelected={selection === Selection.Market}
		/>
		<Item
			href="/decks"
			icon=""
			title="Decks"
			isSelected={selection === Selection.Decks}
		/>
		<Item
			href="/interests"
			icon=""
			title="Interests"
			isSelected={selection === Selection.Interests}
		/>
	</div>
)
