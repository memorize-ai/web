import { useContext, useEffect } from 'react'

import DecksContext from '../contexts/Decks'
import {
	updateOwnedDeck,
	updateDeckUserData,
	removeOwnedDeck
} from '../actions'
import useCurrentUser from './useCurrentUser'
import Deck from '../models/Deck'
import { compose } from '../utils'

export default () => {
	const [{ ownedDecks }, dispatch] = useContext(DecksContext)
	const [currentUser] = useCurrentUser()
	
	useEffect(() => {
		if (!currentUser || Deck.isObservingOwned[currentUser.id])
			return
		
		Deck.isObservingOwned[currentUser.id] = true
		
		Deck.observeForUserWithId(currentUser.id, {
			updateDeck: compose(dispatch, updateOwnedDeck),
			updateDeckUserData: compose(dispatch, updateDeckUserData),
			removeDeck: compose(dispatch, removeOwnedDeck)
		})
	}, [currentUser]) // eslint-disable-line
	
	return ownedDecks
}
