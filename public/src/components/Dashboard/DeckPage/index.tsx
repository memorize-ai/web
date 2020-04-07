import React from 'react'

import Dashboard, { DashboardNavbarSelection as Selection, selectionFromUrl } from '..'
import Deck from '../../../models/Deck'
import useQuery from '../../../hooks/useQuery'
import BackButton from '../../shared/BackButton'
import { urlWithQuery } from '../../../utils'

import '../../../scss/components/Dashboard/DeckPage.scss'

export const urlForDeckPage = (deck: Deck, action: 'get' | null = null) => {
	const { pathname, search } = window.location
	
	return urlWithQuery(`/d/${deck.slug}`, {
		prev: `${pathname}${search}`,
		action
	})
}

export default () => {
	const query = useQuery()
	
	const previousUrl = query.get('prev')
	const selection = (previousUrl && selectionFromUrl(previousUrl)) || Selection.Market
	
	return (
		<Dashboard
			selection={selection}
			className="deck-page"
			gradientHeight="500px"
			navbarProps={{
				'data-aos': 'fade-out',
				'data-aos-anchor': '#deck-page-navbar-aos-anchor',
				'data-aos-anchor-placement': 'top-top'
			}}
			navbarOverlay={
				<div
					data-aos="fade-in"
					data-aos-anchor="#deck-page-navbar-aos-anchor"
					data-aos-anchor-placement="top-top"
				>
					Navbar
				</div>
			}
		>
			<BackButton
				to={previousUrl || '/'}
				
			/>
			<div className="box" id="deck-page-navbar-aos-anchor">
				{/* TODO: Add content */}
			</div>
		</Dashboard>
	)
}