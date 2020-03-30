import React from 'react'
import { faHome, faShoppingCart, faFolder, faUser } from '@fortawesome/free-solid-svg-icons'

import { DashboardNavbarSelection as Selection } from '.'
import Item from './NavbarItem'

import '../../scss/components/Dashboard/Navbar.scss'

export default ({ selection }: { selection: Selection }) => (
	<div className="dashboard-navbar">
		<Item
			href="/"
			icon={faHome}
			title="Home"
			isSelected={selection === Selection.Home}
		/>
		<Item
			href="/market"
			icon={faShoppingCart}
			title="Market"
			isSelected={selection === Selection.Market}
		/>
		<Item
			href="/decks"
			icon={faFolder}
			title="Decks"
			isSelected={selection === Selection.Decks}
		/>
		<Item
			href="/interests"
			icon={faUser}
			title="Interests"
			isSelected={selection === Selection.Interests}
		/>
	</div>
)
