import { useContext, useEffect } from 'react'

import SectionsContext from '../contexts/Sections'
import {
	initializeSections,
	addSection,
	updateSection,
	removeSection
} from '../actions'
import Section from '../models/Section'
import { compose } from '../utils'

export default (deckId: string | null | undefined) => {
	const [_sections, dispatch] = useContext(SectionsContext)
	const sections = deckId ? _sections[deckId] : null
	
	useEffect(() => {
		if (!deckId || sections)
			return
		
		dispatch(initializeSections(deckId))
		
		Section.observeForDeckWithId(deckId, {
			initializeSections: compose(dispatch, initializeSections),
			addSection: compose(dispatch, addSection),
			updateSection: compose(dispatch, updateSection),
			removeSection: compose(dispatch, removeSection)
		})
	}, [deckId, sections]) // eslint-disable-line
	
	return sections ?? []
}
