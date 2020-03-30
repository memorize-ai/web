import React from 'react'

import { DashboardNavbarSelection as Selection } from '.'
import Tab from './NavbarTab'

import { ReactComponent as Home } from '../../images/icons/home.svg'
import { ReactComponent as Cart } from '../../images/icons/cart.svg'
import { ReactComponent as Decks } from '../../images/icons/decks.svg'
import { ReactComponent as Topics } from '../../images/icons/topics.svg'

import '../../scss/components/Dashboard/Navbar.scss'

export default ({ selection }: { selection: Selection }) => (
	<div className="dashboard-navbar">
		<div className="tabs">
			<Tab href="/" title="Home" isSelected={selection === Selection.Home}>
				<Home />
			</Tab>
			<Tab href="/market" title="Market" isSelected={selection === Selection.Market}>
				<Cart />
			</Tab>
			<Tab href="/decks" title="Decks" isSelected={selection === Selection.Decks}>
				<Decks />
			</Tab>
			<Tab href="/interests" title="Interests" isSelected={selection === Selection.Interests}>
				<Topics />
			</Tab>
		</div>
	</div>
)
