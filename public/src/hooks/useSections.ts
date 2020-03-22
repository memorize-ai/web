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
import { compose2 } from '../utils'

export default (deck: Deck | null | undefined) => {
	const [, dispatch] = useContext(DecksContext)
	
	useEffect(() => {
		if (!deck || deck.isObservingSections)
			return
		
		dispatch(setIsObservingSections(deck.id, true))
		
		Section.observeForDeckWithId(deck.id, {
			addSection: compose2(dispatch, addSection),
			updateSection: compose2(dispatch, updateSection),
			removeSection: compose2(dispatch, removeSection)
		})
	}, [deck]) // eslint-disable-line
	
	return deck?.sections ?? []
}
