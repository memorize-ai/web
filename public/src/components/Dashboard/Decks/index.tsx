import React, { useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'

import Dashboard, { DashboardNavbarSelection as Selection } from '..'
import requiresAuth from '../../../hooks/requiresAuth'
import useQuery from '../../../hooks/useQuery'
import useSelectedDeck from '../../../hooks/useSelectedDeck'
import useDecks from '../../../hooks/useDecks'
import Content from './Content'
import Modal from '../../shared/Modal'
import { APP_STORE_URL } from '../../../constants'

import '../../../scss/components/Dashboard/Decks.scss'
import Screenshot, { ScreenshotType } from '../../shared/Screenshot'

export default () => {
	requiresAuth()
	
	const { slug } = useParams()
	const history = useHistory()
	
	const [selectedDeck, setSelectedDeck] = useSelectedDeck()
	const decks = useDecks()
	
	const isNew = useQuery().get('new') === '1'
	const [isIntroModalShowing, setIsIntroModalShowing] = useState(isNew)
	
	useEffect(() => {
		if (!slug && selectedDeck)
			history.replace(`/decks/${selectedDeck.slug}`)
	}, [slug, selectedDeck]) // eslint-disable-line
	
	useEffect(() => {
		if (selectedDeck && selectedDeck.slug === slug)
			return
		
		const deck = decks.find(deck => deck.slug === slug)
		
		deck && setSelectedDeck(deck)
	}, [selectedDeck, slug, decks]) // eslint-disable-line
	
	useEffect(() => {
		if (isNew)
			history.replace(window.location.pathname)
	}, [isNew, history])
	
	return (
		<Dashboard selection={Selection.Decks} className="decks" gradientHeight="350px">
			{selectedDeck
				? <Content deck={selectedDeck} />
				: 'Loading...'
			}
			<Modal
				className="deck-intro"
				isShowing={isIntroModalShowing}
				setIsShowing={setIsIntroModalShowing}
			>
				<div className="header">
					<h2 className="title">
						We're glad to have you.
					</h2>
					<button
						className="hide"
						onClick={() => setIsIntroModalShowing(false)}
					>
						<FontAwesomeIcon icon={faTimesCircle} />
					</button>
				</div>
				<div className="content">
					<p className="left">
						To start reviewing, you'll need to <a href={APP_STORE_URL}>download our app on the App Store</a>.
					</p>
					<a className="right" href="/#screenshots">
						<Screenshot type={ScreenshotType.Review} />
					</a>
				</div>
			</Modal>
		</Dashboard>
	)
}
