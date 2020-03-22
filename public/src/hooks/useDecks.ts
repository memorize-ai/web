import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { compose } from 'redux'

import { State } from '../reducers'
import {
	updateDeck,
	updateDeckUserData,
	removeDeck,
	setIsObservingDecks
} from '../actions'
import useCurrentUser from './useCurrentUser'
import Deck from '../models/Deck'

export default () => {
	const dispatch = useDispatch()
	
	const decks = useSelector((state: State) => state.decks)
	const isObservingDecks = useSelector((state: State) => state.isObservingDecks)
	
	const [currentUser] = useCurrentUser()
	
	useEffect(() => {
		if (isObservingDecks || !currentUser)
			return
		
		dispatch(setIsObservingDecks(true))
		
		Deck.observeForUserWithId(currentUser.uid, {
			updateDeck: compose(dispatch, updateDeck),
			updateDeckUserData: compose(dispatch, updateDeckUserData),
			removeDeck: compose(dispatch, removeDeck)
		})
	}, [isObservingDecks, currentUser]) // eslint-disable-line
	
	return decks
}
