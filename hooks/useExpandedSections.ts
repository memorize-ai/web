import { useContext, useCallback, useMemo } from 'react'

import Deck from 'models/Deck'
import ExpandedSectionsContext from 'contexts/ExpandedSections'
import { toggleSectionExpanded } from 'actions'

const useExpandedSections = (
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
	
	const sections = useMemo(() => _sections ?? {}, [_sections])
	
	return [
		useCallback((sectionId: string) => {
			const isExpanded = sections[sectionId]
			
			return isExpanded === undefined
				? defaultExpanded
				: defaultExpanded
					? !isExpanded
					: isExpanded
		}, [sections, defaultExpanded]),
		useCallback((sectionId: string) => (
			dispatch(toggleSectionExpanded(deck.id, sectionId, isOwned))
		), [dispatch, deck, isOwned])
	] as const
}

export default useExpandedSections
