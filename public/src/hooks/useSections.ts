import { useContext, useEffect } from 'react'

import DecksContext from '../contexts/Decks'
import {
	addSection,
	updateSection,
	removeSection,
	setIsObservingSections
} from '../actions'
import Deck from '../models/Deck'
import Section from '../models/Section'
import { compose } from '../utils'

export default (deck: Deck | null | undefined) => {
	const [, dispatch] = useContext(DecksContext)
	
	useEffect(() => {
		if (!deck || deck.isObservingSections)
			return
		
		dispatch(setIsObservingSections(deck.id, true))
		
		Section.observeForDeckWithId(deck.id, {
			addSection: compose(dispatch, addSection),
			updateSection: compose(dispatch, updateSection),
			removeSection: compose(dispatch, removeSection)
		})
	}, [deck])
	
	return deck?.sections ?? []
}
