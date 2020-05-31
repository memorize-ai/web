import { useContext, useEffect } from 'react'

import CardsContext from '../contexts/Cards'
import {
	initializeCards,
	addCard,
	updateCard,
	updateCardUserData,
	removeCard
} from '../actions'
import Deck from '../models/Deck'
import Section from '../models/Section'
import Card from '../models/Card'
import useCurrentUser from './useCurrentUser'
import { compose } from '../utils'

export default (deck: Deck, section: Section, shouldLoadCards: boolean): Card[] | null => {
	const [state, dispatch] = useContext(CardsContext)
	
	const [currentUser] = useCurrentUser()
	const cards: Card[] = state[section.id] as any
	
	useEffect(() => {
		if (!shouldLoadCards || Card.observers[section.id] || cards || !currentUser)
			return
		
		Card.observers[section.id] = true
		
		Card.observe({
			deckId: deck.id,
			sectionId: section.id,
			uid: currentUser.id,
			initializeCards: compose(dispatch, initializeCards),
			addCard: compose(dispatch, addCard),
			updateCard: compose(dispatch, updateCard),
			updateCardUserData: compose(dispatch, updateCardUserData),
			removeCard: compose(dispatch, removeCard)
		})
	}, [shouldLoadCards, cards, currentUser])
	
	return cards ?? null
}
