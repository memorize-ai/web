import { useContext, useEffect } from 'react'

import SectionsContext from '../contexts/Sections'
import { addSections, updateSection, removeSection } from '../actions'
import Section from '../models/Section'
import { compose } from '../utils'

export default (deckId: string | null | undefined) => {
	const [_sections, dispatch] = useContext(SectionsContext)
	const sections = (deckId && _sections[deckId]) || null
	
	useEffect(() => {
		if (!deckId || Section.observers[deckId] || sections)
			return
		
		Section.observers[deckId] = true
		
		Section.observeForDeckWithId(deckId, {
			addSections: compose(dispatch, addSections),
			updateSection: compose(dispatch, updateSection),
			removeSection: compose(dispatch, removeSection)
		})
	}, [deckId, sections])
	
	return sections
}
