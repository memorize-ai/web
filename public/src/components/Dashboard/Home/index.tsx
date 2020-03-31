import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { faApple } from '@fortawesome/free-brands-svg-icons'
import _ from 'lodash'

import Dashboard, { DashboardNavbarSelection as Selection } from '..'
import useCurrentUser from '../../../hooks/useCurrentUser'
import useDecks from '../../../hooks/useDecks'
import useRecommendedDecks from '../../../hooks/useRecommendedDecks'
import DueDeckRow from './DueDeckRow'
import OwnedDeckCell from '../../shared/DeckCell/Owned'
import DeckCell from '../../shared/DeckCell'
import { APP_STORE_URL } from '../../../constants'

import '../../../scss/components/Dashboard/Home.scss'

export default () => {
	const [currentUser] = useCurrentUser()
	
	const decks = useDecks()
	const recommendedDecks = useRecommendedDecks(20)
	
	const dueDecks = decks
		.filter(deck => deck.userData?.numberOfDueCards)
		.sort(({ userData: a }, { userData: b }) =>
			a!.numberOfDueCards - b!.numberOfDueCards
		)
	
	const dueCards = dueDecks.reduce((acc, deck) => (
		acc + deck.userData!.numberOfDueCards
	), 0)
	
	return (
		<Dashboard selection={Selection.Home} className="home">
			<div className="create-deck-container">
				<Link to="/new">
					<FontAwesomeIcon icon={faPlus} />
					<p>Create deck</p>
				</Link>
			</div>
			{dueCards === 0 || (
				<div className="due-decks">
					<h1 className="greeting">
						Hello, {currentUser?.name ?? '...'}
					</h1>
					<h3 className="count-message">
						You have {dueCards} card{dueCards === 1 ? '' : 's'} due
					</h3>
					<div className="download-link-container">
						<a href={APP_STORE_URL}>
							<FontAwesomeIcon icon={faApple} />
							<p>Download app to review</p>
						</a>
					</div>
					<div className="decks">
						{_.chunk(dueDecks, 2).map((chunk, i) => (
							<div key={i} className="column">
								{chunk.map(deck => (
									<DueDeckRow key={deck.id} deck={deck} />
								))}
							</div>
						))}
					</div>
					<p className="deck-count-message">
						{dueDecks.length} deck{dueDecks.length === 1 ? '' : 's'}
					</p>
				</div>
			)}
			<div className="my-decks">
				<h1>My decks</h1>
				<div className="decks">
					{decks.map(deck => (
						<OwnedDeckCell key={deck.id} deck={deck} />
					))}
					<span>&nbsp;</span>
				</div>
			</div>
			<div className="recommended-decks">
				<h1>Recommended decks</h1>
				<div className="decks">
					{recommendedDecks.map(deck => (
						<DeckCell key={deck.id} deck={deck} />
					))}
					<span>&nbsp;</span>
				</div>
			</div>
		</Dashboard>
	)
}
