import React, { useEffect, useContext } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import cx from 'classnames'

import Dashboard, { DashboardNavbarSelection as Selection } from '..'
import Deck from '../../../models/Deck'
import LoadingState from '../../../models/LoadingState'
import DeckImageUrlsContext from '../../../contexts/DeckImageUrls'
import requiresAuth from '../../../hooks/requiresAuth'
import useSelectedDeck from '../../../hooks/useSelectedDeck'
import useDecks from '../../../hooks/useDecks'
import Head, { APP_DESCRIPTION } from '../../shared/Head'
import Header from './Header'
import Sections from './Sections'
import Loader from '../../shared/Loader'
import { urlForDeckPage } from '../DeckPage'

import '../../../scss/components/Dashboard/Decks.scss'

export default () => {
	requiresAuth()
	
	const [imageUrls] = useContext(DeckImageUrlsContext)
	
	const { slugId, slug } = useParams()
	const history = useHistory()
	
	const [selectedDeck, setSelectedDeck] = useSelectedDeck()
	const [decks, decksLoadingState] = useDecks()
	
	useEffect(() => {
		if (!slugId && selectedDeck)
			history.replace(`/decks/${selectedDeck.slugId}/${selectedDeck.slug}`)
	}, [slugId, selectedDeck]) // eslint-disable-line
	
	useEffect(() => {
		if (
			!(slugId && slug) ||
			selectedDeck?.slugId === slugId ||
			decksLoadingState !== LoadingState.Success
		)
			return
		
		const deck = decks.find(deck => deck.slugId === slugId)
		
		deck
			? setSelectedDeck(deck)
			: history.replace(`/d/${slugId}/${slug}`)
	}, [slugId, slug, selectedDeck, decksLoadingState, decks]) // eslint-disable-line
	
	return (
		<Dashboard selection={Selection.Decks} className="decks" gradientHeight="500px">
			<Head
				title="My decks | memorize.ai"
				description={`Your decks on memorize.ai. ${APP_DESCRIPTION}`}
				breadcrumbs={[
					[
						{
							name: 'Decks',
							url: window.location.href
						}
					]
				]}
				schemaItems={[
					{
						'@type': 'IndividualProduct',
						productID: selectedDeck?.slugId ?? '...',
						image: (selectedDeck && imageUrls[selectedDeck.id]?.url) ?? Deck.DEFAULT_IMAGE_URL,
						name: selectedDeck?.name ?? 'Deck',
						description: selectedDeck?.description ?? '',
						url: `https://memorize.ai${selectedDeck ? urlForDeckPage(selectedDeck) : ''}`,
						aggregateRating: {
							'@type': 'AggregateRating',
							ratingValue: selectedDeck?.averageRating ?? 0,
							reviewCount: selectedDeck?.numberOfRatings || 1,
							worstRating: selectedDeck?.worstRating ?? 0,
							bestRating: selectedDeck?.bestRating ?? 0
						}
					}
				]}
			/>
			<Header deck={selectedDeck} />
			<div className="content">
				<div className={cx('box', { loading: !selectedDeck })}>
					{selectedDeck
						? <Sections deck={selectedDeck} />
						: <Loader size="24px" thickness="4px" color="#582efe" />
					}
				</div>
			</div>
		</Dashboard>
	)
}
