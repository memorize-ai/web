import { useCallback } from 'react'
import { useRecoilState } from 'recoil'

import Deck from 'models/Deck'
import state from 'state/expandedSections'

export interface UseExpandedSectionsOptions {
	isOwned: boolean
	defaultExpanded: boolean
}

const useExpandedSections = (
	deck: Deck,
	{ isOwned, defaultExpanded }: UseExpandedSectionsOptions
) => {
	const key = isOwned ? 'ownedDecks' : 'decks'

	const [
		{
			[key]: { [deck.id]: sections }
		},
		setState
	] = useRecoilState(state)

	return [
		useCallback(
			(sectionId: string) => {
				const isExpanded = sections?.has(sectionId)

				return isExpanded === undefined
					? defaultExpanded
					: defaultExpanded
					? !isExpanded
					: isExpanded
			},
			[sections, defaultExpanded]
		),
		useCallback(
			(sectionId: string) => {
				setState(state => {
					const sections = state[key][deck.id] ?? new Set<string>()
					sections[sections.has(sectionId) ? 'delete' : 'add'](sectionId)

					return {
						...state,
						[key]: { ...state[key], [deck.id]: sections }
					}
				})
			},
			[key, deck.id, setState]
		)
	] as const
}

export default useExpandedSections
