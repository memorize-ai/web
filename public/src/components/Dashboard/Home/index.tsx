import React from 'react'
import { Link } from 'react-router-dom'

import Dashboard, { DashboardTabSelection as Selection } from '..'
import useCurrentUser from '../../../hooks/useCurrentUser'
import useRecommendedDecks from '../../../hooks/useRecommendedDecks'
import useDecks from '../../../hooks/useDecks'
import Decks from './Decks'
import RecommendedDecks from './RecommendedDecks'

import '../../../scss/components/Dashboard/Home.scss'

export default () => {
	const [currentUser] = useCurrentUser()
	const decks = useDecks()
	const recommendedDecks = useRecommendedDecks(20)
	
	const numberOfDueCards = decks.reduce((acc, deck) => (
		acc + (deck.userData?.numberOfDueCards ?? 0)
	), 0)
	
	return (
		<Dashboard selection={Selection.Home} className="home">
			<div className="header">
				<div className="left">
					<h1>Hello, {currentUser?.name}</h1>
					<p className="due-cards-message">
						You have {numberOfDueCards} card{numberOfDueCards === 1 ? '' : 's'} due
					</p>
				</div>
				<Link to="/new">
					Create deck
				</Link>
			</div>
			{decks.length ? <Decks /> : null}
			{recommendedDecks.length
				? <RecommendedDecks decks={recommendedDecks} />
				: null
			}
		</Dashboard>
	)
}
