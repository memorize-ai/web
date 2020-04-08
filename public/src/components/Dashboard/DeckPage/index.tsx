import React from 'react'
import { useParams } from 'react-router-dom'
import Schema, { IndividualProduct } from 'schema.org-react'

import Dashboard, { DashboardNavbarSelection as Selection, selectionFromUrl } from '..'
import Deck from '../../../models/Deck'
import useQuery from '../../../hooks/useQuery'
import BackButton from '../../shared/BackButton'
import { urlWithQuery } from '../../../utils'

import '../../../scss/components/Dashboard/DeckPage.scss'
import useDeck from '../../../hooks/useDeck'

export const urlForDeckPage = (deck: Deck, action: 'get' | null = null) => {
	const { pathname, search } = window.location
	
	return urlWithQuery(`/d/${deck.slug}`, {
		prev: `${pathname}${search}`,
		action
	})
}

export default () => {
	const { slug } = useParams()
	const query = useQuery()
	
	const { deck, isOwned } = useDeck(slug)
	
	const previousUrl = query.get('prev')
	const selection = (previousUrl && selectionFromUrl(previousUrl)) || Selection.Market
	
	return (
		<Dashboard selection={selection} className="deck-page" gradientHeight="500px">
			<Schema<IndividualProduct> item={{
				'@context': 'https://schema.org',
				'@type': 'IndividualProduct'
			}} />
			<BackButton to={previousUrl || '/market'} />
			<div className="box">
				<p>{deck?.name}</p>
				<p>{isOwned.toString()}</p>
			</div>
		</Dashboard>
	)
}
