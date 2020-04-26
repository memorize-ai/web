import React, { useEffect } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import cx from 'classnames'

import Dashboard, { DashboardNavbarSelection as Selection } from '..'
import LoadingState from '../../../models/LoadingState'
import requiresAuth from '../../../hooks/requiresAuth'
import useSelectedDeck from '../../../hooks/useSelectedDeck'
import useDecks from '../../../hooks/useDecks'
import Header from './Header'
import Sections from './Sections'
import Loader from '../../shared/Loader'

import '../../../scss/components/Dashboard/Decks.scss'

export default () => {
	requiresAuth()
	
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
