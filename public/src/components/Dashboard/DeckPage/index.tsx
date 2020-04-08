import React from 'react'
import { useParams } from 'react-router-dom'
import Schema, { IndividualProduct } from 'schema.org-react'
import cx from 'classnames'

import Dashboard, { DashboardNavbarSelection as Selection, selectionFromUrl } from '..'
import Deck from '../../../models/Deck'
import useQuery from '../../../hooks/useQuery'
import BackButton from '../../shared/BackButton'
import Header from './Header'
import Loader from '../../shared/Loader'
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
	
	const { deck, hasDeck } = useDeck(slug)
	
	const previousUrl = query.get('prev')
	const selection = (previousUrl && selectionFromUrl(previousUrl)) || Selection.Market
	
	return (
		<Dashboard selection={selection} className="deck-page" gradientHeight="500px">
			<Schema<IndividualProduct> item={{
				'@context': 'https://schema.org',
				'@type': 'IndividualProduct'
			}} />
			<BackButton to={previousUrl || '/market'} />
			<div className={cx('box', { loading: !deck })}>
				{deck
					? (
						<>
							<Header deck={deck} hasDeck={hasDeck} />
						</>
					)
					: <Loader size="24px" thickness="4px" color="#582efe" />
				}
			</div>
		</Dashboard>
	)
}
