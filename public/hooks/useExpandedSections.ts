import { useContext } from 'react'

import Deck from 'models/Deck'
import ExpandedSectionsContext from 'context/ExpandedSections'
import { toggleSectionExpanded } from 'actions'

export default (
	deck: Deck,
	{ isOwned, defaultExpanded }: {
		isOwned: boolean
		defaultExpanded: boolean
	}
) => {
	const key = isOwned ? 'ownedDecks' : 'decks'
	
	const [
		{ [key]: { [deck.id]: _sections } },
		dispatch
	] = useContext(ExpandedSectionsContext)
	
	const sections = _sections ?? {}
	
	return [
		(sectionId: string) => {
			const isExpanded = sections[sectionId]
			
			return isExpanded === undefined
				? defaultExpanded
				: defaultExpanded
					? !isExpanded
					: isExpanded
		},
		(sectionId: string) => dispatch(toggleSectionExpanded(deck.id, sectionId, isOwned))
	] as const
}
