import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { compose } from 'redux'

import {
	addSection,
	updateSection,
	removeSection,
	setIsObservingSections
} from '../actions'
import Deck from '../models/Deck'
import Section from '../models/Section'

export default (deck: Deck | null | undefined) => {
	const dispatch = useDispatch()
	
	useEffect(() => {
		if (!deck || deck.isObservingSections)
			return
		
		dispatch(setIsObservingSections(deck.id, true))
		
		Section.observeForDeckWithId(deck.id, {
			addSection: compose(dispatch, addSection),
			updateSection: compose(dispatch, updateSection),
			removeSection: compose(dispatch, removeSection)
		})
	}, [deck]) // eslint-disable-line
	
	return deck?.sections ?? []
}
