import { useContext } from 'react'

import Deck from '../models/Deck'
import ExpandedSectionsContext from '../contexts/ExpandedSections'
import { toggleSectionExpanded } from '../actions'

export default (deck: Deck): [(sectionId: string) => boolean, (sectionId: string) => void] => {
	const [{ [deck.id]: _sections }, dispatch] = useContext(ExpandedSectionsContext)
	const sections = _sections ?? []
	
	return [
		sections.includes.bind(sections),
		(sectionId: string) => dispatch(toggleSectionExpanded(deck.id, sectionId))
	]
}
