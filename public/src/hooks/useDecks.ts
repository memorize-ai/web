import { useContext, useEffect } from 'react'

import DecksContext from '../contexts/Decks'
import {
	updateDeck,
	updateDeckUserData,
	removeDeck,
	setIsObservingDecks
} from '../actions'
import useCurrentUser from './useCurrentUser'
import Deck from '../models/Deck'
import { compose } from '../utils'

export default () => {
	const [{ decks, isObservingDecks }, dispatch] = useContext(DecksContext)
	const [currentUser] = useCurrentUser()
	
	useEffect(() => {
		if (isObservingDecks || !currentUser)
			return
		
		dispatch(setIsObservingDecks(true))
		
		Deck.observeForUserWithId(currentUser.id, {
			updateDeck: compose(dispatch, updateDeck),
			updateDeckUserData: compose(dispatch, updateDeckUserData),
			removeDeck: compose(dispatch, removeDeck)
		})
	}, [isObservingDecks, currentUser]) // eslint-disable-line
	
	return decks
}
