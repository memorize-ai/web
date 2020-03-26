import { useContext, useEffect } from 'react'

import CardsContext from '../contexts/Cards'
import {
	addCard,
	updateCard,
	updateCardUserData,
	removeCard
} from '../actions'
import Deck from '../models/Deck'
import Section from '../models/Section'
import Card from '../models/Card'
import useCurrentUser from './useCurrentUser'
import { compose2 } from '../utils'

export default (deck: Deck, section: Section, shouldLoadCards: boolean): Card[] | null => {
	const [{ [section.id]: cards }, dispatch] = useContext(CardsContext)
	
	const [currentUser] = useCurrentUser()
	
	useEffect(() => {
		if (!shouldLoadCards || cards || !currentUser)
			return
		
		Card.observe({
			deckId: deck.id,
			sectionId: section.id,
			uid: currentUser.id,
			addCard: compose2(dispatch, addCard),
			updateCard: compose2(dispatch, updateCard),
			updateCardUserData: compose2(dispatch, updateCardUserData),
			removeCard: compose2(dispatch, removeCard)
		})
	}, [shouldLoadCards, cards, currentUser]) // eslint-disable-line
	
	return cards ?? null
}
