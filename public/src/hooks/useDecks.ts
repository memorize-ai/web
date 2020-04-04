import { useContext, useEffect } from 'react'

import DecksContext from '../contexts/Decks'
import {
	updateDeck,
	updateDeckUserData,
	removeDeck
} from '../actions'
import useCurrentUser from './useCurrentUser'
import Deck from '../models/Deck'
import { compose } from '../utils'

export default () => {
	const [{ decks }, dispatch] = useContext(DecksContext)
	const [currentUser] = useCurrentUser()
	
	useEffect(() => {
		if (!currentUser || Deck.isObserving[currentUser.id])
			return
		
		Deck.isObserving[currentUser.id] = true
		
		Deck.observeForUserWithId(currentUser.id, {
			updateDeck: compose(dispatch, updateDeck),
			updateDeckUserData: compose(dispatch, updateDeckUserData),
			removeDeck: compose(dispatch, removeDeck)
		})
	}, [currentUser])
	
	return decks
}
