import React from 'react'

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
	const recommendedDecks = useRecommendedDecks()
	
	const numberOfDueCards = decks.reduce((acc, deck) => (
		acc + (deck.userData?.numberOfDueCards ?? 0)
	), 0)
	
	return (
		<Dashboard selection={Selection.Home} className="home">
			<h1>Hello, {currentUser?.name}</h1>
			<p className="due-cards-message">
				You have {numberOfDueCards} card{numberOfDueCards === 1 ? '' : 's'} due
			</p>
			{decks.length ? <Decks /> : null}
			{recommendedDecks.length
				? <RecommendedDecks decks={recommendedDecks} />
				: null
			}
		</Dashboard>
	)
}
