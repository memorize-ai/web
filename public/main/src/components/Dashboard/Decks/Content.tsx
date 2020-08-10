import React, { useEffect, memo } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import cx from 'classnames'

import Deck from '../../../models/Deck'
import LoadingState from '../../../models/LoadingState'
import requiresAuth from '../../../hooks/requiresAuth'
import useSelectedDeck from '../../../hooks/useSelectedDeck'
import useDecks from '../../../hooks/useDecks'
import Head from '../../shared/Head'
import Header from './Header'
import Sections from './Sections'
import Loader from '../../shared/Loader'

import '../../../scss/components/Dashboard/Decks.scss'

const DecksContent = () => {
	const { slugId, slug, unlockSectionId } = useParams()
	
	requiresAuth(!unlockSectionId)
	
	const history = useHistory()
	
	const [selectedDeck, setSelectedDeck] = useSelectedDeck()
	const [decks, decksLoadingState] = useDecks()
	
	useEffect(() => {
		if (!slugId && selectedDeck)
			history.replace(`/decks/${selectedDeck.slugId}/${selectedDeck.slug}`)
	}, [slugId, selectedDeck, history])
	
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
	}, [slugId, slug, selectedDeck, decksLoadingState, decks, history, setSelectedDeck])
	
	return (
		<>
			<Head
				title={
					`${selectedDeck
							? `${selectedDeck.name} | `
							: ''
					}My decks | memorize.ai`
				}
				description={
					`${selectedDeck
						? `${selectedDeck.name} - `
						: ''
					}My decks on memorize.ai.`
				}
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
						image: selectedDeck?.imageUrl ?? Deck.DEFAULT_IMAGE_URL,
						name: selectedDeck?.name ?? 'Deck',
						description: selectedDeck?.description ?? '',
						url: selectedDeck?.urlWithOrigin ?? 'https://memorize.ai',
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
		</>
	)
}

export default DecksContent
