import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

import Dashboard, { DashboardNavbarSelection as Selection } from '..'
import useCurrentUser from '../../../hooks/useCurrentUser'
import useDecks from '../../../hooks/useDecks'
import useRecommendedDecks from '../../../hooks/useRecommendedDecks'
import useRemoveDeckModal from '../../../hooks/useRemoveDeckModal'
import OwnedDeckCell from '../../shared/DeckCell/Owned'
import DeckCell from '../../shared/DeckCell'
import RemoveDeckModal from '../../shared/Modal/RemoveDeck'
import { formatNumber } from '../../../utils'

import '../../../scss/components/Dashboard/Home.scss'

export default () => {
	const [currentUser] = useCurrentUser()
	
	const decks = useDecks()
	const recommendedDecks = useRecommendedDecks(20)
	const [removeDeck, removeDeckModalProps] = useRemoveDeckModal()
	
	const dueCards = decks
		.filter(deck => deck.userData?.numberOfDueCards)
		.sort(({ userData: a }, { userData: b }) =>
			a!.numberOfDueCards - b!.numberOfDueCards
		)
		.reduce((acc, deck) => (
			acc + deck.userData!.numberOfDueCards
		), 0)
	
	const decksByCardsDue = decks.sort((a, b) =>
		(b.userData?.numberOfDueCards ?? 0) - (a.userData?.numberOfDueCards ?? 0)
	)
	
	return (
		<Dashboard selection={Selection.Home} className="home" gradientHeight="500px">
			<div className="header">
				<div className="left">
					<h1 className="title">
						Hello, {currentUser?.name}
					</h1>
					<h3 className="subtitle">
						You have {dueCards ? formatNumber(dueCards) : 'no'} card{dueCards === 1 ? '' : 's'} due
					</h3>
				</div>
				<Link to="/new" className="create-deck-link">
					<FontAwesomeIcon icon={faPlus} />
					<p>Create deck</p>
				</Link>
			</div>
			{decks.length === 0 || (
				<div className="my-decks">
					<h1>My decks</h1>
					<div className="decks">
						<div>
							{decksByCardsDue
								.filter((_, i) => !(i & 1))
								.map(deck => (
									<OwnedDeckCell key={deck.id} deck={deck} />
								))
							}
						</div>
						<div>
							{decksByCardsDue
								.filter((_, i) => i & 1)
								.map(deck => (
									<OwnedDeckCell key={deck.id} deck={deck} />
								))
							}
						</div>
					</div>
				</div>
			)}
			{recommendedDecks.length === 0 || (
				<div className="recommended-decks">
					<h1 style={{ color: decks.length ? 'black' : 'white' }}>
						Recommended decks
					</h1>
					<div className="decks">
						<div>
							{recommendedDecks
								.filter((_, i) => !(i & 1))
								.map(deck => (
									<DeckCell
										key={deck.id}
										deck={deck}
										onRemove={() => removeDeck(deck)}
									/>
								))
							}
						</div>
						<div>
							{recommendedDecks
								.filter((_, i) => i & 1)
								.map(deck => (
									<DeckCell
										key={deck.id}
										deck={deck}
										onRemove={() => removeDeck(deck)}
									/>
								))
							}
						</div>
					</div>
				</div>
			)}
			<RemoveDeckModal {...removeDeckModalProps} />
		</Dashboard>
	)
}
